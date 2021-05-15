import { UpdateOperation } from "../../manager/SheetManagerApi";
import { SheetManager } from "../../manager/SheetManager";
import { getColumn, getManyToOneColumn } from "../Dto";

class EntityUpdateServiceImpl {
  /**
   * Updates entity in google sheets
   * @param entity entity
   */
  update(entity: any | any[]): Promise<void> {
    if (Array.isArray(entity)) {
      return this.updateMany(entity);
    }

    return this.updateSingle(entity);
  }

  // TODO can be optimized more
  /**
   * Updates a list of entities in google sheets.
   * @param entityList
   */
  private updateMany(entityList: any[]) {
    const updateOperations: UpdateOperation[] = [];
    for (const entryListElement of entityList) {
      updateOperations.push(...this.extractUpdateOperations(entryListElement));
    }

    return SheetManager.update(updateOperations);
  }

  /**
   * Updates a single entity
   * @param entity entity
   */
  private updateSingle(entity: any) {
    const updateOperations: UpdateOperation[] = this.extractUpdateOperations(entity);
    console.log("WWW operations", updateOperations);
    return Promise.resolve();
    //return SheetManager.update(updateOperations);
  }

  /**
   * Creates a list of update operations out of an entry.
   * @param entry entry
   */
  private extractUpdateOperations(entry: any): UpdateOperation[] {
    if (!entry) {
      return [];
    }
    const updateOperations: UpdateOperation[] = [];

    const spreadSheetName = entry.getSpreadsheetName();
    const sheetName = entry.getTableName();
    const lookupColumnName = entry.getPrimaryKeyColumn().columnId;

    const lookupValueFieldPropertyName = entry.getPrimaryKeyColumn().fieldPropertyName;
    const lookupValue = entry[lookupValueFieldPropertyName];

    const propertyMap: { [index: string]: object } = {};

    for (const key of Object.keys(entry)) {
      const manyToOneColumn = getManyToOneColumn(entry, key);
      const column = getColumn(entry, key);

      if (column) {
        propertyMap[column.columnId] = entry[key];
      } else if (manyToOneColumn) {
        const nestedOperation = this.extractUpdateOperations(entry[key]);
        updateOperations.push(...nestedOperation);

        const pkFieldPropertyName = entry[key].getPrimaryKeyColumn().fieldPropertyName;
        propertyMap[manyToOneColumn.columnId] = entry[key][pkFieldPropertyName];
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

export const EntityUpdateService = new EntityUpdateServiceImpl();
