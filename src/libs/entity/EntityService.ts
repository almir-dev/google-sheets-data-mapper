import { EntityManager } from "./EntityManager";
import { ColumnMetaData, getColumn } from "./Dto";

type DataTable = google.visualization.DataTable;

class EntityServiceImpl {
  toEntityObjects<T>(dataTable: DataTable, entityName: string): T[] {
    const data = this.createDataArrays(dataTable);
    const results: T[] = [];

    for (const element of data) {
      const targetClassObject = EntityManager.entityMap[entityName];
      const result = this.toEntityObject<T>(targetClassObject, element);

      results.push(result);
    }

    return results;
  }

  toEntityObject<T>(target: any, row: any[]): T {
    const fieldsMap: { [key: string]: string } = {};

    for (const key in target) {
      const columnKey: ColumnMetaData = getColumn(target, key);
      fieldsMap[columnKey.columnId] = key;
    }

    row.forEach((column, index) => {
      // @ts-ignore
      target[fieldsMap[this.indexToColumnId(index)]] = row[index];
    });

    return target;
  }

  private createDataArrays(dataTable: DataTable) {
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

  private indexToColumnId(index: number): string {
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

export const EntityService = new EntityServiceImpl();
