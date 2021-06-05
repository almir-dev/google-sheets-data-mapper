import { UpdateOperation } from "../../manager/SheetManagerApi";
import { SheetManager } from "../../manager/SheetManager";
import { getColumn, getManyToOneColumn, getOneToManyColumn } from "../Dto";

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
  private updateSingle(entity: any): Promise<void> {
    const updateOperations: UpdateOperation[] = this.extractUpdateOperations(entity);
    return SheetManager.update(updateOperations);
  }

  /**
   * Creates a list of update operations out of an entry.
   * @param entry entry
   */
  private extractUpdateOperations(entry: any): UpdateOperation[] {
    if (!entry) {
      return [];
    }

    // This is a bug, but a feature as well.
    // It prevents bi-directional recursive operation nesting, because for some reason the nested
    // bi-directional entries do not have entity methods.
    if (!entry.getSpreadsheetName) {
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
      const oneToManyColumn = getOneToManyColumn(entry, key);
      const column = getColumn(entry, key);

      if (column) {
        propertyMap[column.columnId] = entry[key];
      } else if (manyToOneColumn) {
        // Again the hack, nested bi-directional entries do not have entity functions.
        if (entry[key].getPrimaryKeyColumn) {
          const nestedOperation = this.extractUpdateOperations(entry[key]);
          updateOperations.push(...nestedOperation);

          const pkFieldPropertyName = entry[key].getPrimaryKeyColumn().fieldPropertyName;
          propertyMap[manyToOneColumn.columnId] = entry[key][pkFieldPropertyName];
        }
      } else if (oneToManyColumn) {
        // ignored for now
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
