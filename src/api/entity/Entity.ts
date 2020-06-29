import "reflect-metadata";
import { EntityManager } from "./EntityManager";
import { PersistenceManager } from "../PersistenceManager";
import { EntityService } from "./EntityService";
import { Criteria, toQueryString } from "./Criteria";
import { ColumnMetaData, getColumn } from "./Dto";

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

    static find(criteria: Criteria, onResult: (data: T[]) => void) {
      console.log("WWW criteria", criteria);

      const query = new google.visualization.Query(
        PersistenceManager.getActiveSpreadsheetUrl()
      );

      const queryString = "select * " + toQueryString(criteria);
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
  };
}
