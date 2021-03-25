import "reflect-metadata";
import { ColumnProperties, EntityService } from "./EntityService";
import { ColumnMetaData, getColumn, getJoinColumn, getPrimaryKey, JoinColumnMetaData } from "./Dto";
import { CriteriaService } from "../criteria/CriteriaService";
import { QueryOperation } from "../criteria/QueryOperation";
import { SheetManager } from "../manager/SheetManager";
import { UpdateOperation } from "../manager/SheetManagerApi";

export function Entity(spreadSheetName: string, tableName: string, entityName: string) {
  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      private readonly primaryKeyColumn: ColumnProperties;

      constructor(...args: any[]) {
        super(...args);
        for (const key of Object.keys(this)) {
          const columnKey: ColumnMetaData = getColumn(this, key);
          const joinColumnKey: JoinColumnMetaData = getJoinColumn(this, key);
          const primaryKey: boolean = getPrimaryKey(this, key);

          if (columnKey && columnKey.columnId) {
            // @ts-ignore
            this[key] = columnKey.columnId;
          } else if (joinColumnKey) {
            // @ts-ignore
            this[key] = joinColumnKey.columnId;
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
      static async findAll(): Promise<T[]> {
        return ((await EntityService.findEntities(tableName, entityName)) as unknown) as T[];
      }

      /**
       * Finds entities matching the given criteria.
       * @param criteria criteria used for the search
       */
      static async find(criteria: QueryOperation): Promise<T[]> {
        const query = CriteriaService.toQueryString(criteria);
        return ((await EntityService.findEntitiesWithQuery(tableName, entityName, query)) as unknown) as T[];
      }

      /**
       * Creates a new entity.
       * @param entry entry
       */
      static create(entry: any): Promise<void> {
        const values = EntityService.findValuesFromEntity(entry);
        const pk = entry.getPrimaryKeyColumn();
        const pkColumnName = pk.columnId;
        const pkValue = entry[pk.fieldPropertyName];

        return SheetManager.create(spreadSheetName, tableName, values, pkColumnName, pkValue);
      }

      /**
       * Delete an entry.
       * @param entry
       */
      static delete(entry: any): Promise<void> {
        const pkColumnName = entry.getPrimaryKeyColumn().fieldPropertyName;
        const pkValue = entry[pkColumnName];
        return SheetManager.delete(spreadSheetName, tableName, pkColumnName, pkValue);
      }

      /** Updates the entity. */
      static update(entry: any): Promise<void> {
        const updateOperations: UpdateOperation[] = EntityService.extractUpdateOperations(entry);
        return SheetManager.update(updateOperations);
      }
    };
  };
}
