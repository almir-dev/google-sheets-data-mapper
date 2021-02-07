import "reflect-metadata";
import { ColumnProperties, EntityService } from "./EntityService";
import { ColumnMetaData, getColumn, getJoinColumn, getPrimaryKey, JoinColumnMetaData } from "./Dto";
import { CriteriaService } from "../criteria/CriteriaService";
import { QueryOperation } from "../criteria/QueryOperation";
import { SheetManager } from "../SheetManager";
import { EntityMapper } from "./EntityMapper";

export function Entity(tableName: string, entityName: string) {
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

      /** Returns the meta information of the tables primary key.*/
      getPrimaryKeyColumn() {
        return this.primaryKeyColumn;
      }

      /** Finds all entities. */
      static async findAll(): Promise<T[]> {
        //const entityList = await EntityService.findEntities(tableName, entityName);
        //const foo = await EntityService.getReferenceEntityMap(entityName);

        EntityService.findEntities(tableName, entityName);

        return Promise.resolve([]);
      }

      /**
       * Finds entities matching the given criteria.
       * @param criteria criteria used for the search
       */
      static find(criteria: QueryOperation): Promise<T[]> {
        const query = CriteriaService.toQueryString(criteria);
        return SheetManager.findByCriteria(query, tableName).then(response => {
          return Promise.resolve(EntityMapper.toEntityObjects(response, entityName));
        });
      }

      /**
       * Creates a new entity.
       * @param entry entry
       */
      static create(entry: T): Promise<T> {
        const values: string[] = [];
        for (const key of Object.keys(entry)) {
          // @ts-ignore
          const fieldValue = entry[key];
          values.push(fieldValue);
        }

        return SheetManager.create(values).then(() => {
          return Promise.resolve(entry);
        });
      }

      /** Updates the entity. */
      update() {
        console.log("WWW update called");
      }
    };
  };
}
