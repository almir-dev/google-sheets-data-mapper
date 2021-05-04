import { getOneToManyColumn, getOneToOneColumn } from "../Dto";
import { EntityManager } from "../EntityManager";
import { EntityMap, EntityMapper } from "../EntityMapper";
import { SheetManager } from "../../manager/SheetManager";
import { OneToOneEntityService, OneToOneProps } from "./OneToOneEntityService";

interface OneToManyProps {
  referenceEntity: string;
  mappedBy: string;
}

class OneToManyEntityServiceImpl {
  /**
   * Goes through all OneToMany fields in the entity list, and assigns the corresponding values from google sheets to them.
   * @param entityList list of entities
   */
  async fillOneToManyMappings(entityList: any[], recursive: boolean) {
    const oneToManyPropertyFields = this.getOneToOnePropertyFields(entityList[0]);
    const oneToOneMap = await this.getOneToManyEntityMap(entityList);

    oneToManyPropertyFields.forEach(() => {
      entityList.forEach(entity => {
        this.fillReferencesForTargetObject(entity, oneToOneMap, recursive);
      });
    });
  }

  /**
   * Finds all property names of a class annotated with @OneToMany.
   * @param targetClassObject target class object
   * @return list of property names
   */
  private getOneToOnePropertyFields(targetClassObject: any): string[] {
    const oneToManyPropertyNames: string[] = [];
    Object.keys(targetClassObject).forEach(key => {
      if (getOneToManyColumn(targetClassObject, key)) {
        oneToManyPropertyNames.push(key);
      }
    });

    return oneToManyPropertyNames;
  }

  private getOneToManyEntityMap(entityList: any[]): { [index: string]: any } {
    const targetClassObject = entityList[0];
    const oneToManyProperties: OneToManyProps[] = this.getOneToManyProps(targetClassObject.getName());
    const oneToManyRequests = oneToManyProperties.map(props => this.getOneToManyEntities(props));

    return Promise.all(oneToManyRequests).then(result => {
      const finalMap: { [key: string]: EntityMap<any> } = {};

      result.forEach(e => {
        const key = e.key + "-" + e.targetClass;
        finalMap[key] = e.map;
      });

      return Promise.resolve(finalMap);
    });
  }

  /**
   * Recursively iterates over target class and finds all @OneToMany columns.
   * @param targetClassName target class object name
   * @return array of ReferenceEntityJoinProps
   */
  private getOneToManyProps(targetClassName: string): OneToManyProps[] {
    if (!targetClassName) {
      return [];
    }

    const targetClassObject = new EntityManager.entityMap[targetClassName]();

    const oneToManyFieldProperties: OneToManyProps[] = [];
    Object.keys(targetClassObject).forEach(key => {
      const oneToManyColumn = getOneToManyColumn(targetClassObject, key);

      if (oneToManyColumn) {
        const prop = { referenceEntity: targetClassName, mappedBy: key };
        const nestedProps = this.getOneToManyProps(oneToManyColumn.referenceEntity);

        oneToManyFieldProperties.push(...[prop, ...nestedProps]);
      }
    });

    return oneToManyFieldProperties;
  }

  /**
   * Finds all reference entries as a map, by the reference property of the target class object.
   * @param oneToManyProps oneToOne props
   */
  private getOneToManyEntities(oneToManyProps: OneToManyProps) {
    const { referenceEntity, mappedBy } = oneToManyProps;
    const targetClassObject = new EntityManager.entityMap[referenceEntity]();
    const referenceEntityName = OneToManyEntityServiceImpl.getReferenceEntityNameFromProperty(
      targetClassObject,
      mappedBy
    );

    const referenceEntityObject = new EntityManager.entityMap[referenceEntityName]();
    const referenceSpreadSheetName = referenceEntityObject.getSpreadsheetName();
    const referenceTableName = referenceEntityObject.getTableName();

    return this.findEntitiesWithoutReferencesAsMap(
      referenceSpreadSheetName,
      referenceTableName,
      referenceEntityName
    ).then(map => {
      return Promise.resolve({ key: mappedBy, targetClass: referenceEntity, map });
    });
  }

  /**
   * Returns the name of the reference entity, for the given property.
   * @param targetClassObject target class object.
   * @param propertyName property name
   */
  private static getReferenceEntityNameFromProperty(targetClassObject: any, propertyName: string): string {
    const column = getOneToManyColumn(targetClassObject, propertyName);
    return column.referenceEntity;
  }

  /***
   * Finds all entities for the given table name and entity name, without touching reference fields.
   * @param spreadSheetName name of the spreadsheet
   * @param tableName name of the table corresponding to the entity
   * @param entityName name of the entity
   * @return promise of list of entities
   */
  private findEntitiesWithoutReferencesAsMap<T>(
    spreadSheetName: string,
    tableName: string,
    entityName: string
  ): Promise<EntityMap<T>> {
    return SheetManager.findWithoutCriteria(spreadSheetName, tableName).then(googleQueryResponse => {
      const entityObjectMap: EntityMap<T> = EntityMapper.toEntityObjectMap(googleQueryResponse, entityName);
      return entityObjectMap;
    });
  }

  /**
   * Assigns all OneToOne fields of the target class object with values from the oneToManyMap.
   * @param targetClassObject target class object
   * @param oneToManyMap reference entity map
   */
  private fillReferencesForTargetObject(
    targetClassObject: any,
    oneToManyMap: { [key: string]: EntityMap<any>[] },
    recursive: boolean
  ) {
    if (!targetClassObject) {
      return;
    }

    const entityName = targetClassObject.getName();
    const pkColumnPropertyName = targetClassObject.getPrimaryKeyColumn().fieldPropertyName;
    Object.keys(targetClassObject).forEach(key => {
      const oneToMany: OneToManyProps = getOneToManyColumn(targetClassObject, key);
      const oneToOne: OneToOneProps = getOneToOneColumn(targetClassObject, key);
      if (oneToMany) {
        const { mappedBy, referenceEntity } = oneToMany;
        const referenceKey = key + "-" + entityName;
        const targetReferenceMap = oneToManyMap[referenceKey];
        const pk = targetClassObject[pkColumnPropertyName];
        const targetValues = Object.values(targetReferenceMap).filter(e => e[mappedBy] === pk);
        if (targetValues) {
          targetValues.forEach(v => this.fillReferencesForTargetObject(v, oneToManyMap, recursive));
          targetClassObject[key] = targetValues;
        }
      }

      if (oneToOne && recursive) {
        OneToOneEntityService.fillOneToOneMappings([targetClassObject]);
      }
    });
  }
}

export const OneToManyEntityService = new OneToManyEntityServiceImpl();
