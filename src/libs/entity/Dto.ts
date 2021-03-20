import { QueryOperation } from "../criteria/QueryOperation";

const columnMetadataKey = Symbol("column");
const joinColumnMetadataKey = Symbol("joinColumn");
const primaryKeyMetadataKey = Symbol("primaryKey");

export interface ColumnMetaData {
  columnId: string;
}

export interface JoinColumnMetaData {
  columnId: string;
  referenceEntity: string;
}

export function Column(columnId: string) {
  return Reflect.metadata(columnMetadataKey, { columnId });
}

export function JoinColumn(columnId: string, referenceEntity: string) {
  return Reflect.metadata(joinColumnMetadataKey, { columnId, referenceEntity });
}

export function getColumn(target: any, propertyKey: string) {
  return Reflect.getMetadata(columnMetadataKey, target, propertyKey);
}

export function getJoinColumn(target: any, propertyKey: string) {
  return Reflect.getMetadata(joinColumnMetadataKey, target, propertyKey);
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

  static async findAll<T>(): Promise<T[]> {
    return Promise.resolve([]);
  }

  static find<T>(criteria: QueryOperation): Promise<T[]> {
    return Promise.resolve([]);
  }

  static create<T>(entry: T): Promise<T> {
    return Promise.resolve(({} as unknown) as T);
  }

  static delete<T>(entry: T): Promise<void> {
    return Promise.resolve();
  }

  update() {}
}
