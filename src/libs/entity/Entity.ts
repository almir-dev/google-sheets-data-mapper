import "reflect-metadata";
import { EntityManager } from "./EntityManager";
import { EntityService } from "./EntityService";
import { ColumnMetaData, getColumn } from "./Dto";
import { CriteriaService } from "../criteria/CriteriaService";
import { and, QueryOperation, whereEq } from "../criteria/QueryOperation";
import { GoogleQueryResponse, SheetManager } from "../SheetManager";

export function Entity<T extends { new (...args: any[]): {} }>(constructor: T) {
  EntityManager.register(constructor.name, constructor);
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);

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
      return SheetManager.findWithoutCriteria().then(this.handleReadResponse);
    }

    static find(criteria: QueryOperation): Promise<T[]> {
      const query = CriteriaService.toQueryString(criteria);
      return SheetManager.findByCriteria(query).then(this.handleReadResponse);
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
      const queryOperationList: QueryOperation[] = [];
      const values: { [key: string]: any } = {};
      for (const key of Object.keys(this)) {
        // @ts-ignore
        const fieldValue = this[key];
        // @ts-ignore
        const columnKey = getColumn(this, key).columnId;
        queryOperationList.push(whereEq(columnKey, fieldValue));
        values[key] = fieldValue;
      }

      const query = CriteriaService.toQueryString(and(...queryOperationList));

      SheetManager.read("data").then(result => {
        const ranges: string[] = [];
        result.rows.forEach(row => {
          const targetClassObject = new EntityManager.entityMap[
            constructor.name
          ]();
          const entry = EntityService.toEntityObject(
            targetClassObject,
            row.values
          );
          if (JSON.stringify(entry) === JSON.stringify(values)) {
            ranges.push(row.range);
          }
        });
      });
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
}
