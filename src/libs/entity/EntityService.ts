import { getColumn, getManyToOneColumn } from "./Dto";
import { UpdateOperation } from "../manager/SheetManagerApi";

export interface ColumnProperties {
  /** Id of the column (Capitalized Letter). */
  columnId: string;
  /** Name of the property field. */
  fieldPropertyName: string;
  /** Name of the parent entity which is defining the column. */
  referenceEntity: string;
}

class EntityServiceImpl {
  /**
   * Creates a list of update operations out of an entry.
   * @param entry entry
   */
  extractUpdateOperations(entry: any): UpdateOperation[] {
    const updateOperations: UpdateOperation[] = [];

    const spreadSheetName = entry.getSpreadsheetName();
    const sheetName = entry.getTableName();
    const lookupColumnName = entry.getPrimaryKeyColumn().columnId;

    const lookupValueFieldPropertyName = entry.getPrimaryKeyColumn().fieldPropertyName;
    const lookupValue = entry[lookupValueFieldPropertyName];

    const propertyMap: { [index: string]: object } = {};

    for (const key of Object.keys(entry)) {
      const joinColumn = getManyToOneColumn(entry, key);
      const column = getColumn(entry, key);

      if (column) {
        propertyMap[column.columnId] = entry[key];
      } else if (joinColumn) {
        const nestedOperation = this.extractUpdateOperations(entry[key]);
        updateOperations.push(...nestedOperation);

        const pkFieldPropertyName = entry[key].getPrimaryKeyColumn().fieldPropertyName;
        propertyMap[joinColumn.columnId] = entry[key][pkFieldPropertyName];
      }
    }

    const sortedColumnIds = Object.keys(propertyMap).sort();
    const values = sortedColumnIds.map(id => propertyMap[id]);

    const operation: UpdateOperation = {
      spreadSheetName,
      sheetName,
      lookupColumnName,
      updateValues: [{ lookupValue, values }]
    };

    updateOperations.push(operation);
    return updateOperations;
  }
}

export const EntityService = new EntityServiceImpl();
