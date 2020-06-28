import "reflect-metadata";
import { EntityManager } from "./EntityManager";
import { PersistenceManager } from "../PersistenceManager";
import { EntityService } from "./EntityService";

export function Entity<T extends { new (...args: any[]): {} }>(constructor: T) {
  EntityManager.register(constructor.name, constructor);
  return class extends constructor {
    static getName() {
      return constructor.name;
    }

    static findAll(onResult: (data: T[]) => void) {
      const query = new google.visualization.Query(
        PersistenceManager.getActiveSpreadsheetUrl()
      );
      query.setQuery("select * ");
      query.send(response => {
        onResult(
          EntityService.toEntityObjects(response.getDataTable(), this.getName())
        );
      });
    }
  };
}
