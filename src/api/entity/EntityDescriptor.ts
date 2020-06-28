import "reflect-metadata";
import { EntityManager } from "./EntityManager";
import { PersistenceManager } from "../PersistenceManager";
import { Student } from "./Student";

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

  static findAll<T>(onResult: (data: T[]) => void) {}
}

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
        onResult(this.toEntityObjects(response.getDataTable()));
      });
    }

    private static toEntityObjects(
      dataTable: google.visualization.DataTable
    ): T[] {
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

      const results: T[] = [];

      for (const element of elements) {
        const targetClassObject = new EntityManager.entityMap[
          Student.getName()
        ]();
        const result = mapSheetResultToEntity<T>(targetClassObject, element);

        results.push(result);
      }

      return results;
    }
  };
}

export function mapSheetResultToEntity<T>(target: any, row: any[]): T {
  const fieldsMap: { [key: string]: string } = {};

  for (const key in target) {
    const columnKey: ColumnMetaData = getColumn(target, key);
    fieldsMap[columnKey.columnId] = key;
  }

  const obj: T = Object.assign({}, target);

  row.forEach((column, index) => {
    // @ts-ignore
    obj[fieldsMap[indexToColumnId(index)]] = row[index];
  });

  return obj;
}

function indexToColumnId(index: number): string {
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
