import { QueryOperation } from "../criteria/QueryOperation";

const columnMetadataKey = Symbol("column");
const oneToOneColumnMetadataKey = Symbol("oneToOneColumn");
const oneToManyMetadataKey = Symbol("oneToManyColumn");
const primaryKeyMetadataKey = Symbol("primaryKey");

export interface ColumnMetaData {
  columnId: string;
}

export interface oneToOneColumnMetaData {
  columnId: string;
  referenceEntity: string;
}

export interface OneToManyColumnMetaData {
  columnId: string;
  referenceEntity: string;
}

export function Column(columnId: string) {
  return Reflect.metadata(columnMetadataKey, { columnId });
}

export function OneToMany(mappedBy: string, referenceEntity: string) {
  return Reflect.metadata(oneToManyMetadataKey, { mappedBy, referenceEntity });
}

export function OneToOneColumn(columnId: string, referenceEntity: string) {
  return Reflect.metadata(oneToOneColumnMetadataKey, { columnId, referenceEntity });
}

export function getColumn(target: any, propertyKey: string) {
  return Reflect.getMetadata(columnMetadataKey, target, propertyKey);
}

export function getOneToOneColumn(target: any, propertyKey: string) {
  return Reflect.getMetadata(oneToOneColumnMetadataKey, target, propertyKey);
}

export function getOneToManyColumn(target: any, propertyKey: string) {
  return Reflect.getMetadata(oneToManyMetadataKey, target, propertyKey);
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

  static create<T>(entry: T): Promise<void> {
    return Promise.resolve();
  }

  static delete<T>(entry: T): Promise<void> {
    return Promise.resolve();
  }

  static update<T>(entry: T): Promise<void> {
    return Promise.resolve();
  }

  static updateMany<T>(entryList: T[]): Promise<void> {
    return Promise.resolve();
  }
}
