import "reflect-metadata";
import { EntityManager } from "./EntityManager";
import { EntityService } from "./EntityService";
import { ColumnMetaData, getColumn } from "./Dto";
import { CriteriaService } from "../criteria/CriteriaService";
import { and, QueryOperation, whereEq } from "../criteria/QueryOperation";
import { GoogleQueryResponse, SheetManager } from "../SheetManager";

export function Entity(tableName: string) {
  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        EntityManager.register(constructor.name, this);

        for (const key of Object.keys(this)) {
          const columnKey: ColumnMetaData = getColumn(this, key);
          // @ts-ignore
          this[key] = columnKey.columnId;
        }
      }

      static getName() {
        return constructor.name;
      }

      static findAll(): Promise<T[]> {
        return SheetManager.findWithoutCriteria(tableName).then(
          this.handleReadResponse
        );
      }

      static find(criteria: QueryOperation): Promise<T[]> {
        const query = CriteriaService.toQueryString(criteria);
        return SheetManager.findByCriteria(query, tableName).then(
          this.handleReadResponse
        );
      }

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

      update() {
        console.log("WWW update called");
        // const queryOperationList: QueryOperation[] = [];
        // const values: { [key: string]: any } = {};
        // for (const key of Object.keys(this)) {
        //   // @ts-ignore
        //   const fieldValue = this[key];
        //   // @ts-ignore
        //   const columnKey = getColumn(this, key).columnId;
        //   queryOperationList.push(whereEq(columnKey, fieldValue));
        //   values[key] = fieldValue;
        // }
        //
        // const query = CriteriaService.toQueryString(and(...queryOperationList));
        //
        // SheetManager.read("StudentTable").then(result => {
        //   const ranges: string[] = [];
        //   result.rows.forEach(row => {
        //     const targetClassObject = new EntityManager.entityMap[
        //       constructor.name
        //     ]();
        //     const entry = EntityService.toEntityObject(
        //       targetClassObject,
        //       row.values
        //     );
        //     if (JSON.stringify(entry) === JSON.stringify(values)) {
        //       ranges.push(row.range);
        //     }
        //   });
        // });
      }

      private static readonly handleReadResponse = (
        queryResponse: GoogleQueryResponse
      ): Promise<T[]> => {
        const result: T[] = EntityService.toEntityObjects(
          queryResponse.getDataTable(),
          constructor.name
        );

        return Promise.resolve(result);
      };
    };
  };
}
