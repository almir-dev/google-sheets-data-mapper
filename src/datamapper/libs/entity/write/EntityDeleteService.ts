import { SheetManager } from "../../manager/SheetManager";

class EntityDeleteServiceImpl {
  /**
   * Removes entity from google sheets.,
   * @param entity
   */
  delete(entity: any): Promise<void> {
    const pkColumnName = entity.getPrimaryKeyColumn().columnId;
    const pkValue = entity[entity.getPrimaryKeyColumn().fieldPropertyName];

    const spreadsheetId = entity.getSpreadsheetId();
    const sheetName = entity.getTableName();

    return SheetManager.delete(spreadsheetId, sheetName, pkColumnName, pkValue);
  }
}

export const EntityDeleteService = new EntityDeleteServiceImpl();
