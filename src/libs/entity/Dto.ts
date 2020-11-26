import { QueryOperation } from "../criteria/QueryOperation";

const columnMetadataKey = Symbol("column");
const primaryKeyMetadataKey = Symbol("column");

export interface ColumnMetaData {
  columnId: string;
}
export function Column(columnId: string) {
  return Reflect.metadata(columnMetadataKey, { columnId });
}

export function getColumn(target: any, propertyKey: string) {
  return Reflect.getMetadata(columnMetadataKey, target, propertyKey);
}

export function PrimaryKey() {
  return Reflect.metadata(primaryKeyMetadataKey, true);
}

export function getPrimaryKey(target: any, propertyKey: string) {
  return Reflect.getMetadata(primaryKeyMetadataKey, target, propertyKey);
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

  static create<T>(entry: T): Promise<T> {
    return Promise.resolve(({} as unknown) as T);
  }

  update() {}
}
