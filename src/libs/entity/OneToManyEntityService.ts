import { EntityMap, EntityMapper } from "./EntityMapper";
import { EntityManager } from "./EntityManager";
import { getOneToManyColumn } from "./Dto";
import { EntityService } from "./EntityService";
import { whereEq } from "../criteria/QueryOperation";
import { CriteriaService } from "../criteria/CriteriaService";
import { SheetManager } from "../manager/SheetManager";

interface ReferenceEntityOneToManyProps {
  referenceEntity: string;
  propertyName: string;
}

class OneToManyEntityServiceImpl {
  // /**
  //  * Creates a map from target class where the key is a joined property name and the value is
  //  * map of its id-entity values.
  //  * @param targetClassName target class name
  //  */
  // private getReferenceEntityMapForOneToManyEntries(targetClassName: string): Promise<{ [key: string]: EntityMap<any>[] }> {
  //     const oneToManyProperties = this.getReferenceEntityOneToManyProps(targetClassName);
  //     const referencePromiseList = oneToManyProperties.map(prop => {
  //         return this.getOneToManyReferenceEntitiesForProperty(prop.referenceEntity, prop.propertyName)
  //     });
  //
  //     console.log('WWW done');
  //     return Promise.resolve({});
  //     // return Promise.all(referencePromiseList).then(result => {
  //     //   const finalMap: { [key: string]: EntityMap<any>[] } = {};
  //     //
  //     //   console.log('WWW result is ', result);
  //     //   // result.forEach(e => {
  //     //   //   const key = e.key + "-" + e.targetClass;
  //     //   //   finalMap[key] = e.map;
  //     //   // });
  //     //
  //     //   return Promise.resolve(finalMap);
  //     // });
  // }
  //
  // /**
  //  * Recursively iterates over target class and finds all one to many columns.
  //  * @param targetClassName target class name
  //  * @return array of ReferenceEntityJoinProps
  //  */
  // private getReferenceEntityOneToManyProps(targetClassName: string): ReferenceEntityOneToManyProps[] {
  //     if(!targetClassName) {
  //         return [];
  //     }
  //
  //     const targetClassObject = new EntityManager.entityMap[targetClassName]();
  //     const oneToManyFieldProperties: ReferenceEntityOneToManyProps[] = [];
  //     Object.keys(targetClassObject).forEach(key => {
  //         const oneToManyColumn = getOneToManyColumn(targetClassObject, key);
  //         if (oneToManyColumn) {
  //             const prop = { referenceEntity: targetClassName, propertyName: key };
  //             const nestedProps = this.getReferenceEntityOneToManyProps(oneToManyColumn.referenceEntity);
  //             oneToManyFieldProperties.push(...[prop, ...nestedProps]);
  //         }
  //     });
  //
  //     return oneToManyFieldProperties;
  // }
  //
  // /**
  //  * Finds all reference entries as a map, by the reference property of the target class object.
  //  * @param targetClassName target class name
  //  * @param propertyName property name
  //  */
  // private getOneToManyReferenceEntitiesForProperty(targetClassName: string, propertyName: string) {
  //     const targetClassObject = new EntityManager.entityMap[targetClassName]();
  //     const referenceEntityName = EntityService.getOneToManyReferenceEntityNameFromProperty(targetClassObject, propertyName);
  //
  //     //TODO instanciation can be optimized
  //     const referenceEntityObject = new EntityManager.entityMap[referenceEntityName]();
  //     const referenceSpreadSheetName = referenceEntityObject.getSpreadsheetName();
  //     const referenceTableName = referenceEntityObject.getTableName();
  //
  //     return EntityService.findOneToManyEntitiesWithoutReferencesAsMap(
  //         referenceSpreadSheetName,
  //         referenceTableName,
  //         referenceEntityName
  //     ).then(result => {
  //         console.log('WWW 4', result);
  //         return Promise.resolve({ key: propertyName, targetClass: targetClassName, result });
  //     });
  // }
  //
  //
  // /**
  //  * Returns the name of the reference entity, for the given property.
  //  * @param targetClassObject target class object.
  //  * @param propertyName property name
  //  */
  // private getOneToManyReferenceEntityNameFromProperty(targetClassObject: any, propertyName: string): string {
  //     const column = getOneToManyColumn(targetClassObject, propertyName);
  //     console.log('WWW column', column);
  //     return column.referenceEntity;
  // }
  //
  //
  // private findOneToManyEntitiesWithoutReferencesAsMap<T>(
  //     spreadSheetName: string,
  //     tableName: string,
  //     entityName: string
  // ): Promise<T[]> {
  //     const query = whereEq("A", "id1");
  //     const queryString = CriteriaService.toQueryString(query);
  //     console.log('WWW query string', queryString);
  //     return SheetManager.findByCriteria(queryString, spreadSheetName, tableName).then(googleQueryResponse => {
  //         const entityObjects: T[] = EntityMapper.toEntityObjects(googleQueryResponse, entityName);
  //
  //         return entityObjects;
  //     });
  // }
}

export const OneToManyEntityService = new OneToManyEntityServiceImpl();
