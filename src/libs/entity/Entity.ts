import "reflect-metadata";
import { EntityManager } from "./EntityManager";
import { PersistenceManager } from "../persistence/PersistenceManager";
import { EntityService } from "./EntityService";
import { ColumnMetaData, getColumn } from "./Dto";
import { CriteriaService } from "../criteria/CriteriaService";
import { QueryOperation } from "../criteria/QueryOperation";

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

    static findAll(onResult: (data: T[]) => void) {
      return new Promise<any>(resolve => {
        this.findWithoutCriteria(data => {
          return resolve(data);
        });
      });
    }

    static find(criteria: QueryOperation): Promise<T[]> {
      return new Promise<any>(resolve => {
        this.findByCriteria(criteria, data => {
          return resolve(data);
        });
      });
    }

    private static findByCriteria(
      criteria: QueryOperation,
      onResult: (data: T[]) => void
    ) {
      const query = new google.visualization.Query(
        PersistenceManager.getActiveSpreadsheetUrl()
      );

      const queryString =
        "select * where " + CriteriaService.toQueryString(criteria);
      console.log("WWW critieria is ", queryString);

      query.setQuery(queryString);

      query.send(response => {
        const result: T[] = EntityService.toEntityObjects(
          response.getDataTable(),
          this.getName()
        );
        onResult(result);
      });
    }

    private static findWithoutCriteria(onResult: (data: T[]) => void) {
      const query = new google.visualization.Query(
        PersistenceManager.getActiveSpreadsheetUrl()
      );
      query.setQuery("select * ");
      query.send(response => {
        const result: T[] = EntityService.toEntityObjects(
          response.getDataTable(),
          this.getName()
        );
        onResult(result);
      });
    }
  };
}
