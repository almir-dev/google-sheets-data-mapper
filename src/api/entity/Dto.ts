import { QueryOperation } from "./QueryOperation";

const columnMetadataKey = Symbol("column");

export interface ColumnMetaData {
  column: string;
  columnId: string;
}
export function Column(column: string, columnId: string) {
  return Reflect.metadata(columnMetadataKey, { column, columnId });
}

export function getColumn(target: any, propertyKey: string) {
  return Reflect.getMetadata(columnMetadataKey, target, propertyKey);
}

export class Dto {
  static getName() {
    return "";
  }

  static findAll<T>(): Promise<T[]> {
    return Promise.resolve([]);
  }

  static find<T>(criteria: QueryOperation): Promise<T[]> {
    return Promise.resolve([]);
  }
}
