import "reflect-metadata";
import { EntityManager } from "./EntityManager";
import { SheetManager } from "../SheetManager";

const columnMetadataKey = Symbol("column");

export function Column(column: string) {
  return Reflect.metadata(columnMetadataKey, column);
}

export function getColumn(target: any, propertyKey: string) {
  return Reflect.getMetadata(columnMetadataKey, target, propertyKey);
}

export function Entity<T extends { new (...args: any[]): {} }>(constructor: T) {
  EntityManager.register(constructor.name, constructor);
  return class extends constructor {
    static getName() {
      return constructor.name;
    }

    static findAll(): Promise<any[]> {
      const targetClassObject = new EntityManager.entityMap[this.getName()]();
      return SheetManager.read("data").then(response => {
        const values: any[] = [];
        response.values.forEach(row => {
          const value: any = mapSheetResultToEntity(
            targetClassObject,
            row,
            response.header
          );
          values.push(value);
        });
        return Promise.resolve(values);
      });
    }
  };
}

export class Dto {
  static findAll<T>(): Promise<T[]> {
    return Promise.resolve([]);
  }

  static findWhere<T>(): Promise<T[]> {
    return Promise.resolve([]);
  }
}
function mapSheetResultToEntity<T>(target: any, row: any[], headers: any[]): T {
  const fieldsMap: { [key: string]: string } = {};

  for (const key in target) {
    const columnKey = getColumn(target, key);
    fieldsMap[columnKey] = key;
  }

  const obj: T = Object.assign({}, target);

  row.forEach((column, index) => {
    // @ts-ignore
    obj[fieldsMap[headers[index]]] = column;
  });

  return obj;
}
