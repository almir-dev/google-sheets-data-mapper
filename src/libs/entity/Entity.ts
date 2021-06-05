import "reflect-metadata";
import {
  ColumnMetaData,
  getColumn,
  getManyToOneColumn,
  getOneToManyColumn,
  getPrimaryKey,
  ManyToOneColumnMetaData,
  OneToManyColumnMetaData
} from "./Dto";
import { QueryOperation } from "../criteria/QueryOperation";
import { EntityFetchService } from "./read/EntityFetchService";
import { EntityCreateService } from "./write/EntityCreateService";
import { EntityDeleteService } from "./write/EntityDeleteService";
import { EntityUpdateService } from "./write/EntityUpdateService";
import { CriteriaService } from "../criteria/CriteriaService";

interface ColumnProperties {
  /** Id of the column (Capitalized Letter). */
  columnId: string;
  /** Name of the property field. */
  fieldPropertyName: string;
  /** Name of the parent entity which is defining the column. */
  referenceEntity: string;
  /** Last known fetched values*/
  lastValue?: any;
}

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
            // @ts-ignore
            this[key] = oneToManyColumnKey.columnId;
          }

          if (primaryKey) {
            this.primaryKeyColumn = {
              columnId: columnKey.columnId,
              fieldPropertyName: key,
              referenceEntity: "NOT-DEFINED",
              // @ts-ignore
              lastValue: this[key]
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

      /** Sets the lastValue of the pk. */
      setPkValue(value: any) {
        this.primaryKeyColumn.lastValue = value;
      }

      /** Sets the lastValue of the pk. */
      getLastPkValue(): any {
        return this.primaryKeyColumn.lastValue;
      }

      /** Finds all entities. */
      static findAll(): Promise<T[]> {
        return (EntityFetchService.findEntities(spreadSheetName, tableName, entityName) as unknown) as Promise<T[]>;
      }

      /** Finds entity by id. */
      static findById(id: string): Promise<T> {
        return (EntityFetchService.findEntityById(spreadSheetName, tableName, entityName, id) as unknown) as Promise<T>;
      }

      /**
       * Finds entities matching the given criteria.
       * @param criteria criteria used for the search
       */
      static find(criteria: QueryOperation): Promise<T[]> {
        const queryString = CriteriaService.toQueryString(criteria);
        return (EntityFetchService.findEntitiesWithQuery(
          spreadSheetName,
          tableName,
          entityName,
          queryString
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
      static update(entry: any | any[]): Promise<void> {
        return EntityUpdateService.update(entry);
      }
    };
  };
}
