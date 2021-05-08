import { SheetManager } from "../../manager/SheetManager";
import { EntityMapper } from "../EntityMapper";
import { getManyToOneColumn, getOneToManyColumn } from "../Dto";
import { EntityManager } from "../EntityManager";

interface EntityContextValue {
  result: any[];
  resultMap: { [index: string]: any };
}

interface EntityContext {
  [index: string]: EntityContextValue;
}

interface ReferenceFieldProp {
  spreadSheetName: string;
  sheetName: string;
  referenceEntity: string;
}

interface PreviousContext {
  parentEntity: any;
  mappedBy: string;
}

class EntityFetchServiceImpl {
  /**
   * Finds all entities and all their referenced children.
   * @param spreadSheetName name of the spreadSheet
   * @param tableName table name
   * @param entityName entity name
   */
  findEntities(spreadSheetName: string, tableName: string, entityName: string): Promise<any[]> {
    return this.findEntitiesWithoutReferences(spreadSheetName, tableName, entityName).then(entityList => {
      return this.createEntityContext(entityList).then(context => {
        const updatedEntityList: any[] = [];
        entityList.forEach(entity => {
          const updatedEntity = this.getFilledReferenceEntity(entity, context);
          updatedEntityList.push(updatedEntity);
        });
        return Promise.resolve(updatedEntityList);
      });
    });
  }

  private getFilledReferenceEntity(entity: any, context: EntityContext, previousContext?: PreviousContext): any {
    if (!entity) {
      return undefined;
    }

    const filledReferenceEntity = { ...entity };

    Object.keys(entity).forEach(key => {
      const manyToOneColumn = getManyToOneColumn(entity, key);
      const oneToManyColumn = getOneToManyColumn(entity, key);

      if (oneToManyColumn) {
        const { referenceEntity, mappedBy } = oneToManyColumn;
        const targetClassObject = new EntityManager.entityMap[referenceEntity]();
        const spreadSheetName = targetClassObject.getSpreadsheetName();
        const sheetName = targetClassObject.getTableName();
        const targetContextKey = [spreadSheetName, sheetName].join("-");
        const targetContext = context[targetContextKey];

        const entityPkColumn = entity.getPrimaryKeyColumn().fieldPropertyName;
        const contextResult = targetContext.result.filter(e => {
          return e[mappedBy] === entity[entityPkColumn];
        });

        const filledContextResult: any[] = [];

        const prevContext: PreviousContext = {
          parentEntity: { ...entity },
          mappedBy
        };

        contextResult.forEach(e => {
          filledContextResult.push(this.getFilledReferenceEntity(e, { ...context }, prevContext));
        });

        filledReferenceEntity[key] = filledContextResult;
      }

      if (manyToOneColumn) {
        const { referenceEntity } = manyToOneColumn;
        const targetClassObject = new EntityManager.entityMap[referenceEntity]();

        const spreadSheetName = targetClassObject.getSpreadsheetName();
        const sheetName = targetClassObject.getTableName();

        const targetContextKey = [spreadSheetName, sheetName].join("-");
        const targetContext = context[targetContextKey];

        const contextResult = targetContext.resultMap[entity[key]];

        if (previousContext?.mappedBy === key) {
          filledReferenceEntity[key] = { ...previousContext.parentEntity };
        } else {
          const filledContextResult = this.getFilledReferenceEntity(contextResult, { ...context });
          filledReferenceEntity[key] = filledContextResult;
        }
      }
    });

    return filledReferenceEntity;
  }

  private createEntityContext(entityList: any[]): Promise<EntityContext> {
    if (!entityList.length) {
      return Promise.resolve({});
    }
    const context: EntityContext = {};

    const referenceProps = this.getReferenceFieldProps(entityList[0]);

    const requests = referenceProps.map(prop => {
      const { spreadSheetName, sheetName, referenceEntity } = prop;
      const key = [spreadSheetName, sheetName].join("-");
      return this.findEntitiesWithoutReferences(spreadSheetName, sheetName, referenceEntity).then(result => {
        return Promise.resolve({ key, result });
      });
    });

    return Promise.all(requests).then(result => {
      result.forEach(e => {
        const resultMap: { [index: string]: any } = {};

        e.result.forEach((entity: any) => {
          const pkColumn = entity.getPrimaryKeyColumn().fieldPropertyName;
          const pk = entity[pkColumn];
          resultMap[pk] = entity;
        });

        context[e.key] = {
          result: e.result,
          resultMap
        };
      });
      return Promise.resolve(context);
    });
  }

  private getReferenceFieldProps(targetClassObject: any): ReferenceFieldProp[] {
    const fields = this.getReferenceFieldPropsRecursively(targetClassObject, []);
    const uniqueFieldsMap: { [index: string]: ReferenceFieldProp } = {};
    fields.forEach(field => {
      const key = field.spreadSheetName + "-" + field.sheetName;
      uniqueFieldsMap[key] = field;
    });

    return Object.values(uniqueFieldsMap);
  }

  private getReferenceFieldPropsRecursively(
    targetClassObject: any,
    initProps: ReferenceFieldProp[]
  ): ReferenceFieldProp[] {
    if (!targetClassObject) {
      return [];
    }

    const spreadSheetName = targetClassObject.getSpreadsheetName();
    const sheetName = targetClassObject.getTableName();
    const entityName = targetClassObject.getName();

    if (initProps.find(e => e.spreadSheetName === spreadSheetName && e.sheetName === sheetName) !== undefined) {
      return [];
    }

    const props = { spreadSheetName, sheetName, referenceEntity: entityName };
    initProps.push(props);

    Object.keys(targetClassObject).forEach(key => {
      const manyToOneColumn = getManyToOneColumn(targetClassObject, key);
      const oneToManyColumn = getOneToManyColumn(targetClassObject, key);

      if (manyToOneColumn || oneToManyColumn) {
        const referenceEntity = manyToOneColumn ? manyToOneColumn.referenceEntity : oneToManyColumn.referenceEntity;
        const nestedTargetClassObject = new EntityManager.entityMap[referenceEntity]();
        const nestedProps = this.getReferenceFieldPropsRecursively(nestedTargetClassObject, [...initProps]);
        initProps.push(...nestedProps);
      }
    });

    return initProps;
  }

  /**
   * Finds all entities and all their referenced children, by given query.
   * @param tableName table name
   * @param entityName entity name
   * @param query query string
   */
  findEntitiesWithQuery(spreadSheetName: string, tableName: string, entityName: string, query: string) {
    return this.findEntitiesWithoutReferencesByQuery(query, spreadSheetName, tableName, entityName).then(entityList => {
      return Promise.resolve(entityList);
    });
  }

  /***
   * Finds all entities for the given table name and entity name, without touching reference fields.
   * @param spreadSheetName name of the spreadSheet
   * @param tableName name of the table corresponding to the entity
   * @param entityName name of the entity
   * @return promise of list of entities
   */
  private findEntitiesWithoutReferences<T>(
    spreadSheetName: string,
    tableName: string,
    entityName: string
  ): Promise<T[]> {
    return SheetManager.findWithoutCriteria(spreadSheetName, tableName)
      .then(googleQueryResponse => {
        const entityObjectList: T[] = EntityMapper.toEntityObjects(googleQueryResponse, entityName);
        return Promise.resolve(entityObjectList);
      })
      .catch(error => {
        console.log("Failed to findEntitiesWithoutReferences ", error);
        return Promise.reject();
      });
  }

  /***
   * Finds all entities for the given table name and entity name, without touching reference fields.
   * @param tableName name of the table corresponding to the entity
   * @param entityName name of the entity
   * @param query search query
   * @return promise of list of entities
   */
  private findEntitiesWithoutReferencesByQuery<T>(
    spreadsheetName: string,
    tableName: string,
    entityName: string,
    query: string
  ): Promise<T[]> {
    return SheetManager.findByCriteria(query, spreadsheetName, tableName).then(googleQueryResponse => {
      const entityObjectList: T[] = EntityMapper.toEntityObjects(googleQueryResponse, entityName);

      return Promise.resolve(entityObjectList);
    });
  }
}

export const EntityFetchService = new EntityFetchServiceImpl();
