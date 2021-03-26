import { EntityManager } from "./EntityManager";
import { getColumn, getJoinColumn } from "./Dto";
import { EntityMap, EntityMapper } from "./EntityMapper";
import { SheetManager } from "../manager/SheetManager";
import { UpdateOperation } from "../manager/SheetManagerApi";

export interface ColumnProperties {
  /** Id of the column (Capitalized Letter). */
  columnId: string;
  /** Name of the property field. */
  fieldPropertyName: string;
  /** Name of the parent entity which is defining the column. */
  referenceEntity: string;
}

interface ReferenceEntityJoinProps {
  referenceEntity: string;
  propertyName: string;
}

class EntityServiceImpl {
  /**
   * Finds all entities and all their referenced children.
   * @param spreadSheetName name of the spreadSheet
   * @param tableName table name
   * @param entityName entity name
   */
  async findEntities(spreadSheetName: string, tableName: string, entityName: string) {
    const entityList = await this.findEntitiesWithoutReferences(spreadSheetName, tableName, entityName);
    const referenceMap = await this.getReferenceEntityMap(entityName);

    const joinProperties = this.getJoinFieldsFromClass(entityName);

    joinProperties.forEach(property => {
      entityList.forEach(entity => {
        this.fillReferencesForTargetObject(entity, referenceMap);
      });
    });

    return Promise.resolve(entityList);
  }

  /**
   * Finds all entities and all their referenced children, by given query.
   * @param tableName table name
   * @param entityName entity name
   */
  async findEntitiesWithQuery(tableName: string, entityName: string, query: string) {
    const entityList = await this.findEntitiesWithoutReferencesByQuery(tableName, entityName, query);
    const referenceMap = await this.getReferenceEntityMap(entityName);

    const joinProperties = this.getJoinFieldsFromClass(entityName);

    joinProperties.forEach(property => {
      entityList.forEach(entity => {
        this.fillReferencesForTargetObject(entity, referenceMap);
      });
    });

    return Promise.resolve(entityList);
  }

  /**
   * Retrieves all field values sorted by column names from the given entity.
   * @param entry entry
   * @return list of field property values
   */
  findValuesFromEntity(entry: any): object[] {
    const propertyMap: { [index: string]: object } = {};
    for (const key of Object.keys(entry)) {
      const column = getColumn(entry, key);
      const joinColumn = getJoinColumn(entry, key);

      if (column) {
        propertyMap[column.columnId] = entry[key];
      } else if (joinColumn) {
        const referenceEntityPkPropertyKey = entry[key].getPrimaryKeyColumn().fieldPropertyName;
        propertyMap[joinColumn.columnId] = entry[key][referenceEntityPkPropertyKey];
      }
    }

    const sortedColumnIds = Object.keys(propertyMap).sort();
    return sortedColumnIds.map(id => propertyMap[id]);
  }

  /**
   * Creates a list of update operations out of an entry.
   * @param entry entry
   */
  extractUpdateOperations(entry: any): UpdateOperation[] {
    const updateOperations: UpdateOperation[] = [];

    const spreadSheetName = entry.getSpreadsheetName();
    const sheetName = entry.getTableName();
    const lookupColumnName = entry.getPrimaryKeyColumn().columnId;

    const lookupValueFieldPropertyName = entry.getPrimaryKeyColumn().fieldPropertyName;
    const lookupValue = entry[lookupValueFieldPropertyName];

    const propertyMap: { [index: string]: object } = {};

    for (const key of Object.keys(entry)) {
      const joinColumn = getJoinColumn(entry, key);
      const column = getColumn(entry, key);

      if (column) {
        propertyMap[column.columnId] = entry[key];
      } else if (joinColumn) {
        const nestedOperation = this.extractUpdateOperations(entry[key]);
        updateOperations.push(...nestedOperation);

        const pkFieldPropertyName = entry[key].getPrimaryKeyColumn().fieldPropertyName;
        propertyMap[joinColumn.columnId] = entry[key][pkFieldPropertyName];
      }
    }

    const sortedColumnIds = Object.keys(propertyMap).sort();
    const values = sortedColumnIds.map(id => propertyMap[id]);

    const operation: UpdateOperation = {
      spreadSheetName,
      sheetName,
      lookupColumnName,
      updateValues: [{ lookupValue, values }]
    };

    updateOperations.push(operation);
    return updateOperations;
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
  private findEntitiesWithoutReferencesByQuery<T>(tableName: string, entityName: string, query: string): Promise<T[]> {
    return SheetManager.findByCriteria(query, tableName).then(googleQueryResponse => {
      const entityObjectList: T[] = EntityMapper.toEntityObjects(googleQueryResponse, entityName);

      return Promise.resolve(entityObjectList);
    });
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
   * Creates a map from target class where the key is a joined property name and the value is
   * map of its id-entity values.
   * @param targetClassName target class name
   */
  private getReferenceEntityMap(targetClassName: string): Promise<{ [key: string]: EntityMap<any> }> {
    const joinProperties = this.getReferenceEntityJoinProps(targetClassName);

    const referencePromiseList = joinProperties.map(prop =>
      this.getReferenceEntitiesForProperty(prop.referenceEntity, prop.propertyName)
    );

    return Promise.all(referencePromiseList).then(result => {
      const finalMap: { [key: string]: EntityMap<any> } = {};

      result.forEach(e => {
        const key = e.key + "-" + e.targetClass;
        finalMap[key] = e.map;
      });

      return Promise.resolve(finalMap);
    });
  }

  /**
   * Assigns all reference fiends values from the corresponding entry in the referenceEntityMap.
   * @param targetClassObject target class object
   * @param referenceEntityMap reference entity map
   */
  private fillReferencesForTargetObject(targetClassObject: any, referenceEntityMap: { [key: string]: EntityMap<any> }) {
    if (!targetClassObject) {
      return;
    }

    Object.keys(targetClassObject).forEach(key => {
      const joinColumn = getJoinColumn(targetClassObject, key);
      if (joinColumn) {
        const entityName = targetClassObject.getName();
        const referenceKey = key + "-" + entityName;
        const targetReferenceMap = referenceEntityMap[referenceKey];
        const pk = targetClassObject[key];
        const targetValue = targetReferenceMap[pk];
        if (targetValue) {
          this.fillReferencesForTargetObject(targetValue, referenceEntityMap);
          targetClassObject[key] = targetValue;
        }
      }
    });
  }

  /**
   * Finds all reference entries as a map, by the reference property of the target class object.
   * @param targetClassName target class name
   * @param propertyName property name
   */
  private getReferenceEntitiesForProperty(targetClassName: string, propertyName: string) {
    const targetClassObject = new EntityManager.entityMap[targetClassName]();
    const referenceEntityName = EntityService.getReferenceEntityNameFromProperty(targetClassObject, propertyName);

    //TODO instanciation can be optimized
    const referenceEntityObject = new EntityManager.entityMap[referenceEntityName]();
    const referenceSpreadSheetName = referenceEntityObject.getSpreadsheetName();
    const referenceTableName = referenceEntityObject.getTableName();

    return EntityService.findEntitiesWithoutReferencesAsMap(
      referenceSpreadSheetName,
      referenceTableName,
      referenceEntityName
    ).then(map => {
      return Promise.resolve({ key: propertyName, targetClass: targetClassName, map });
    });
  }

  /**
   * Returns the name of the reference entity, for the given property.
   * @param targetClassObject target class object.
   * @param propertyName property name
   */
  private getReferenceEntityNameFromProperty(targetClassObject: any, propertyName: string): string {
    const column = getJoinColumn(targetClassObject, propertyName);
    return column.referenceEntity;
  }

  /**
   * Finds all property names of a class annotated with @Join.
   * @param targetClassName name of the target class
   * @return list of property names
   */
  private getJoinFieldsFromClass(targetClassName: string): string[] {
    const targetClassObject = new EntityManager.entityMap[targetClassName]();
    const joinFieldProperties: string[] = [];
    Object.keys(targetClassObject).forEach(key => {
      if (getJoinColumn(targetClassObject, key)) {
        joinFieldProperties.push(key);
      }
    });

    return joinFieldProperties;
  }

  /**
   * Recursively iterates over target class and finds all join columns.
   * @param targetClassName target class name
   * @return array of ReferenceEntityJoinProps
   */
  private getReferenceEntityJoinProps(targetClassName: string): ReferenceEntityJoinProps[] {
    const targetClassObject = new EntityManager.entityMap[targetClassName]();
    const joinFieldProperties: ReferenceEntityJoinProps[] = [];
    Object.keys(targetClassObject).forEach(key => {
      const joinColumn = getJoinColumn(targetClassObject, key);
      if (joinColumn) {
        const prop = { referenceEntity: targetClassName, propertyName: key };
        const nestedProps = this.getReferenceEntityJoinProps(joinColumn.referenceEntity);
        joinFieldProperties.push(...[prop, ...nestedProps]);
      }
    });

    return joinFieldProperties;
  }
}

export const EntityService = new EntityServiceImpl();
