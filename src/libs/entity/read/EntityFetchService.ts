import { ManyToOneEntityService } from "./ManyToOneEntityService";
import { SheetManager } from "../../manager/SheetManager";
import { EntityMapper } from "../EntityMapper";
import { OneToManyEntityService } from "./OneToManyEntityService";

class EntityFetchServiceImpl {
  /**
   * Finds all entities and all their referenced children.
   * @param spreadSheetName name of the spreadSheet
   * @param tableName table name
   * @param entityName entity name
   */
  async findEntities(spreadSheetName: string, tableName: string, entityName: string) {
    const entityList = await this.findEntitiesWithoutReferences(spreadSheetName, tableName, entityName);
    if (entityList.length) {
      await ManyToOneEntityService.fillManyToOneMappings(entityList);
      await OneToManyEntityService.fillOneToManyMappings(entityList, true);
    }
    return Promise.resolve(entityList);
  }

  /**
   * Finds all entities and all their referenced children, by given query.
   * @param tableName table name
   * @param entityName entity name
   * @param query query string
   */
  async findEntitiesWithQuery(spreadSheetName: string, tableName: string, entityName: string, query: string) {
    const entityList = await this.findEntitiesWithoutReferencesByQuery(query, spreadSheetName, tableName, entityName);
    return Promise.resolve(entityList);
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
