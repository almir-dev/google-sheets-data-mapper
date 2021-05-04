import { EntityMap, EntityMapper } from "../EntityMapper";
import { EntityManager } from "../EntityManager";
import { getOneToManyColumn, getManyToOneColumn } from "../Dto";
import { SheetManager } from "../../manager/SheetManager";
import { OneToManyEntityService } from "./OneToManyEntityService";

export interface ManyToOneProps {
  referenceEntity: string;
  propertyName: string;
}

class ManyToOneEntityServiceImpl {
  /**
   * Goes through all @ManyToOne fields in the entity list, and assigns the corresponding values from google sheets to them.
   * @param entityList list of entities
   */
  async fillManyToOneMappings(entityList: any[]) {
    const manyToOnePropertyFields = this.getManyToOnePropertyFields(entityList[0]);
    const manyToOneMap = await this.getManyToOneEntityMap(entityList[0]);

    manyToOnePropertyFields.forEach(() => {
      entityList.forEach(entity => {
        this.fillReferencesForTargetObject(entity, manyToOneMap);
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
      const oneToOne = getManyToOneColumn(targetClassObject, key);
      const oneToMany = getOneToManyColumn(targetClassObject, key);

      if (oneToOne) {
        const referenceKey = key + "-" + entityName;
        const targetReferenceMap = oneToOneMap[referenceKey];
        const pk = targetClassObject[key];
        const targetValue = targetReferenceMap[pk];
        if (targetValue) {
          this.fillReferencesForTargetObject(targetValue, oneToOneMap);
          targetClassObject[key] = targetValue;
        }
      } else if (oneToMany) {
        OneToManyEntityService.fillOneToManyMappings([targetClassObject], false);
      }
    });
  }

  /**
   * Finds all property names of a class annotated with @ManyToOne.
   * @param targetClassObject target class object
   * @return list of property names
   */
  private getManyToOnePropertyFields(targetClassObject: any): string[] {
    const manyToOnePropertyNames: string[] = [];
    Object.keys(targetClassObject).forEach(key => {
      if (getManyToOneColumn(targetClassObject, key)) {
        manyToOnePropertyNames.push(key);
      }
    });

    return manyToOnePropertyNames;
  }

  /**
   * Creates a map from target class where the key is a joined property name and the value is
   * map of its id-entity values.
   * @param targetClassObject target class object
   */
  private getManyToOneEntityMap(targetClassObject: any): Promise<{ [key: string]: EntityMap<any> }> {
    const manyToOneProperties: ManyToOneProps[] = this.getManyToOneProps(targetClassObject.getName());
    const manyToOneRequests = manyToOneProperties.map(props => this.getManyToOneEntities(props));

    return Promise.all(manyToOneRequests).then(result => {
      const finalMap: { [key: string]: EntityMap<any> } = {};

      result.forEach(e => {
        const key = e.key + "-" + e.targetClass;
        finalMap[key] = e.map;
      });

      return Promise.resolve(finalMap);
    });
  }

  /**
   * Recursively iterates over target class and finds all @ManyToOne columns.
   * @param targetClassName target class object name
   * @return array of ReferenceEntityJoinProps
   */
  private getManyToOneProps(targetClassName: string): ManyToOneProps[] {
    if (!targetClassName) {
      return [];
    }

    const targetClassObject = new EntityManager.entityMap[targetClassName]();

    const manyToOneFieldProperties: ManyToOneProps[] = [];
    Object.keys(targetClassObject).forEach(key => {
      const manyToOneColumn = getManyToOneColumn(targetClassObject, key);

      if (manyToOneColumn) {
        const prop = { referenceEntity: targetClassName, propertyName: key };
        const nestedProps = this.getManyToOneProps(manyToOneColumn.referenceEntity);

        manyToOneFieldProperties.push(...[prop, ...nestedProps]);
      }
    });

    return manyToOneFieldProperties;
  }

  /**
   * Finds all reference entries as a map, by the reference property of the target class object.
   * @param manyToOneProps manyToOne props
   */
  private getManyToOneEntities(manyToOneProps: ManyToOneProps) {
    const { referenceEntity, propertyName } = manyToOneProps;
    const targetClassObject = new EntityManager.entityMap[referenceEntity]();
    const referenceEntityName = ManyToOneEntityServiceImpl.getReferenceEntityNameFromProperty(
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
    const column = getManyToOneColumn(targetClassObject, propertyName);
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

export const ManyToOneEntityService = new ManyToOneEntityServiceImpl();
