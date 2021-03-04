import { EntityManager } from "./EntityManager";
import { ColumnMetaData, getColumn, getJoinColumn, getPrimaryKey, JoinColumnMetaData } from "./Dto";
import { GoogleQueryResponse } from "../manager/SheetManagerApi";

type DataTable = google.visualization.DataTable;

export interface EntityMap<T> {
  [key: string]: T;
}

class EntityMapperImpl {
  /**
   * Create an entity object out of a google response.
   * @param googleQueryResponse google query response
   * @param targetClassName name of the entity which are being created.
   */
  toEntityObjects<T>(googleQueryResponse: GoogleQueryResponse, targetClassName: string): T[] {
    const data = EntityMapperImpl.createDataArrays(googleQueryResponse.getDataTable());
    const results: T[] = [];

    for (const element of data) {
      const targetClassObject = new EntityManager.entityMap[targetClassName]();
      const result = this.createEntityObject<T>(targetClassObject, element);

      results.push(result);
    }

    return results;
  }

  /**
   * Create an entity object out of a google response.
   * @param googleQueryResponse google query response
   * @param targetClassName name of the entity which are being created.
   */
  toEntityObjectMap<T>(googleQueryResponse: GoogleQueryResponse, targetClassName: string): EntityMap<T> {
    const data = EntityMapperImpl.createDataArrays(googleQueryResponse.getDataTable());
    const entityMap: EntityMap<T> = {};
    const primaryKeyPropertyName = this.findPropertyNameOfPrimaryKey(targetClassName);

    for (const element of data) {
      const targetClassObject = new EntityManager.entityMap[targetClassName]();
      const entityObject = this.createEntityObject<T>(targetClassObject, element);
      // @ts-ignore
      const pkValue = entityObject[primaryKeyPropertyName];

      entityMap[pkValue] = entityObject;
    }

    return entityMap;
  }

  /**
   * Finds the name of primary key property of class.
   * @param targetClassName name of the target class
   * @return name of the primary property
   */
  private findPropertyNameOfPrimaryKey(targetClassName: string): string {
    const targetClassObject = new EntityManager.entityMap[targetClassName]();

    // @ts-ignore
    const primaryKey: string[] = Object.keys(targetClassObject)
      .map(key => (getPrimaryKey(targetClassObject, key) ? key : undefined))
      .filter(element => element);
    if (!primaryKey || primaryKey.length > 1) {
      throw Error("Target class has no primary key!");
    }

    return primaryKey[0];
  }

  private createEntityObject<T>(target: any, row: any[]): T {
    const fieldsMap: { [key: string]: string } = {};

    for (const key in target) {
      const columnKey: ColumnMetaData = getColumn(target, key);
      const joinColumnKey: JoinColumnMetaData = getJoinColumn(target, key);
      if (columnKey && columnKey.columnId) {
        fieldsMap[columnKey.columnId] = key;
      } else if (joinColumnKey) {
        fieldsMap[joinColumnKey.columnId] = key;
      }
    }

    row.forEach((column, index) => {
      // @ts-ignore
      target[fieldsMap[EntityMapperImpl.indexToColumnId(index)]] = row[index];
    });

    return target;
  }

  private static createDataArrays(dataTable: DataTable) {
    const rowLen = dataTable.getNumberOfRows();
    const colLen = dataTable.getNumberOfColumns();

    const elements = [];

    for (let i = 0; i < rowLen; ++i) {
      const element = [];
      for (let j = 0; j < colLen; ++j) {
        const rowValue = dataTable.getValue(i, j);
        element.push(rowValue);
      }
      elements.push(element);
    }

    return elements;
  }

  private static indexToColumnId(index: number): string {
    switch (index) {
      case 0:
        return "A";
      case 1:
        return "B";
      case 2:
        return "C";
      case 3:
        return "D";
      case 4:
        return "E";
      case 5:
        return "F";
      case 6:
        return "G";
      case 7:
        return "H";
      case 8:
        return "I";
      case 9:
        return "J";
    }

    return "A";
  }
}

export const EntityMapper = new EntityMapperImpl();
