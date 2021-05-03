import { EntityMap, EntityMapper } from "../EntityMapper";
import { EntityManager } from "../EntityManager";
import { getOneToManyColumn, getOneToOneColumn } from "../Dto";
import { SheetManager } from "../../manager/SheetManager";
import { OneToManyEntityService } from "./OneToManyEntityService";

export interface OneToOneProps {
  referenceEntity: string;
  propertyName: string;
}

class OneToOneEntityServiceImpl {
  /**
   * Goes through all OneToOne fields in the entity list, and assigns the corresponding values from google sheets to them.
   * @param entityList list of entities
   */
  async fillOneToOneMappings(entityList: any[]) {
    const oneToOnePropertyFields = this.getOneToOnePropertyFields(entityList[0]);
    const oneToOneMap = await this.getOneToOneEntityMap(entityList[0]);

    oneToOnePropertyFields.forEach(() => {
      entityList.forEach(entity => {
        this.fillReferencesForTargetObject(entity, oneToOneMap);
      });
    });
  }

  /**
   * Assigns all OneToOne fields of the target class object with values from the oneToOneMap.
   * @param targetClassObject target class object
   * @param oneToOneMap reference entity map
   */
  private fillReferencesForTargetObject(targetClassObject: any, oneToOneMap: { [key: string]: EntityMap<any> }) {
    if (!targetClassObject) {
      return;
    }

    const entityName = targetClassObject.getName();
    Object.keys(targetClassObject).forEach(key => {
      const oneToOne = getOneToOneColumn(targetClassObject, key);
      if (oneToOne) {
        const referenceKey = key + "-" + entityName;
        const targetReferenceMap = oneToOneMap[referenceKey];
        const pk = targetClassObject[key];
        const targetValue = targetReferenceMap[pk];
        if (targetValue) {
          this.fillReferencesForTargetObject(targetValue, oneToOneMap);
          targetClassObject[key] = targetValue;
        }
      }
    });
  }

  /**
   * Finds all property names of a class annotated with @OneToOne.
   * @param targetClassObject target class object
   * @return list of property names
   */
  private getOneToOnePropertyFields(targetClassObject: any): string[] {
    const oneToOnePropertyNames: string[] = [];
    Object.keys(targetClassObject).forEach(key => {
      if (getOneToOneColumn(targetClassObject, key)) {
        oneToOnePropertyNames.push(key);
      }
    });

    return oneToOnePropertyNames;
  }

  /**
   * Creates a map from target class where the key is a joined property name and the value is
   * map of its id-entity values.
   * @param targetClassObject target class object
   */
  private getOneToOneEntityMap(targetClassObject: any): Promise<{ [key: string]: EntityMap<any> }> {
    const oneToOneProperties: OneToOneProps[] = this.getOneToOneProps(targetClassObject.getName());
    const oneToOneRequests = oneToOneProperties.map(props => this.getOneToOneEntities(props));

    return Promise.all(oneToOneRequests).then(result => {
      const finalMap: { [key: string]: EntityMap<any> } = {};

      result.forEach(e => {
        const key = e.key + "-" + e.targetClass;
        finalMap[key] = e.map;
      });

      return Promise.resolve(finalMap);
    });
  }

  /**
   * Recursively iterates over target class and finds all @OneToOne columns.
   * @param targetClassName target class object name
   * @return array of ReferenceEntityJoinProps
   */
  private getOneToOneProps(targetClassName: string): OneToOneProps[] {
    if (!targetClassName) {
      return [];
    }

    const targetClassObject = new EntityManager.entityMap[targetClassName]();

    const oneToOneFieldProperties: OneToOneProps[] = [];
    Object.keys(targetClassObject).forEach(key => {
      const oneToOneColumn = getOneToOneColumn(targetClassObject, key);

      if (oneToOneColumn) {
        const prop = { referenceEntity: targetClassName, propertyName: key };
        const nestedProps = this.getOneToOneProps(oneToOneColumn.referenceEntity);

        oneToOneFieldProperties.push(...[prop, ...nestedProps]);
      }
    });

    return oneToOneFieldProperties;
  }

  /**
   * Finds all reference entries as a map, by the reference property of the target class object.
   * @param oneToOneProps oneToOne props
   */
  private getOneToOneEntities(oneToOneProps: OneToOneProps) {
    const { referenceEntity, propertyName } = oneToOneProps;
    const targetClassObject = new EntityManager.entityMap[referenceEntity]();
    const referenceEntityName = OneToOneEntityServiceImpl.getReferenceEntityNameFromProperty(
      targetClassObject,
      propertyName
    );

    const referenceEntityObject = new EntityManager.entityMap[referenceEntityName]();
    const referenceSpreadSheetName = referenceEntityObject.getSpreadsheetName();
    const referenceTableName = referenceEntityObject.getTableName();

    return this.findEntitiesWithoutReferencesAsMap(
      referenceSpreadSheetName,
      referenceTableName,
      referenceEntityName
    ).then(map => {
      return Promise.resolve({ key: propertyName, targetClass: referenceEntity, map });
    });
  }

  /**
   * Returns the name of the reference entity, for the given property.
   * @param targetClassObject target class object.
   * @param propertyName property name
   */
  private static getReferenceEntityNameFromProperty(targetClassObject: any, propertyName: string): string {
    const column = getOneToOneColumn(targetClassObject, propertyName);
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
}

export const OneToOneEntityService = new OneToOneEntityServiceImpl();
