import "reflect-metadata";
import { ColumnProperties, EntityService } from "./EntityService";
import {
  ColumnMetaData,
  getColumn,
  getManyToOneColumn,
  getOneToManyColumn,
  getPrimaryKey,
  ManyToOneColumnMetaData,
  OneToManyColumnMetaData
} from "./Dto";
import { CriteriaService } from "../criteria/CriteriaService";
import { QueryOperation } from "../criteria/QueryOperation";
import { SheetManager } from "../manager/SheetManager";
import { UpdateOperation } from "../manager/SheetManagerApi";
import { EntityFetchService } from "./read/EntityFetchService";
import { EntityCreateService } from "./write/EntityCreateService";
import { EntityDeleteService } from "./write/EntityDeleteService";

export function Entity(spreadSheetName: string, tableName: string, entityName: string) {
  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      private readonly primaryKeyColumn: ColumnProperties;

      constructor(...args: any[]) {
        super(...args);
        for (const key of Object.keys(this)) {
          const columnKey: ColumnMetaData = getColumn(this, key);
          const joinColumnKey: ManyToOneColumnMetaData = getManyToOneColumn(this, key);
          const oneToManyColumnKey: OneToManyColumnMetaData = getOneToManyColumn(this, key);
          const primaryKey: boolean = getPrimaryKey(this, key);

          if (columnKey && columnKey.columnId) {
            // @ts-ignore
            this[key] = columnKey.columnId;
          } else if (joinColumnKey) {
            // @ts-ignore
            this[key] = joinColumnKey.columnId;
          } else if (oneToManyColumnKey) {
            // TODO might not be needed
            // @ts-ignore
            this[key] = oneToManyColumnKey.columnId;
          }

          if (primaryKey) {
            this.primaryKeyColumn = {
              columnId: columnKey.columnId,
              fieldPropertyName: key,
              referenceEntity: "NOT-DEFINED"
            };
          }
        }
      }

      /*** Returns the name of the entity.*/
      getName() {
        return entityName;
      }

      /** Returns the associated table name.*/
      getTableName() {
        return tableName;
      }

      /** Return the associated spreadsheet name. */
      getSpreadsheetName() {
        return spreadSheetName;
      }

      /** Returns the meta information of the tables primary key.*/
      getPrimaryKeyColumn() {
        return this.primaryKeyColumn;
      }

      /** Finds all entities. */
      static findAll(): Promise<T[]> {
        return (EntityFetchService.findEntities(spreadSheetName, tableName, entityName) as unknown) as Promise<T[]>;
      }

      /**
       * Finds entities matching the given criteria.
       * @param criteria criteria used for the search
       */
      static find(criteria: QueryOperation): Promise<T[]> {
        const query = CriteriaService.toQueryString(criteria);
        return (EntityFetchService.findEntitiesWithQuery(
          spreadSheetName,
          tableName,
          entityName,
          query
        ) as unknown) as Promise<T[]>;
      }

      /**
       * Creates a new entity.
       * @param entry entry
       */
      static create(entry: any): Promise<void> {
        return EntityCreateService.create(entry);
      }

      /**
       * Delete an entry.
       * @param entry
       */
      static delete(entry: any): Promise<void> {
        return EntityDeleteService.delete(entry);
      }

      /** Updates the entity. */
      static update(entry: any): Promise<void> {
        const updateOperations: UpdateOperation[] = EntityService.extractUpdateOperations(entry);
        return SheetManager.update(updateOperations);
      }

      /** Updates a list of entries*/
      // TODO can be optimized more
      static updateMany(entryList: any[]): Promise<void> {
        const updateOperations: UpdateOperation[] = [];
        for (const entryListElement of entryList) {
          updateOperations.push(...EntityService.extractUpdateOperations(entryListElement));
        }

        return SheetManager.update(updateOperations);
      }
    };
  };
}
