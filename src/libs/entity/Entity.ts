import "reflect-metadata";
import { EntityManager } from "./EntityManager";
import { EntityService } from "./EntityService";
import { ColumnMetaData, getColumn } from "./Dto";
import { CriteriaService } from "../criteria/CriteriaService";
import { QueryOperation } from "../criteria/QueryOperation";
import { SheetManager } from "../SheetManager";

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
      return SheetManager.findWithoutCriteria().then(queryResponse => {
        const result: T[] = EntityService.toEntityObjects(
          queryResponse.getDataTable(),
          this.getName()
        );

        return Promise.resolve(result);
      });
    }

    static find(criteria: QueryOperation): Promise<T[]> {
      const query = CriteriaService.toQueryString(criteria);
      return SheetManager.findByCriteria(query).then(queryResponse => {
        const result: T[] = EntityService.toEntityObjects(
          queryResponse.getDataTable(),
          this.getName()
        );

        return Promise.resolve(result);
      });
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
  };
}
