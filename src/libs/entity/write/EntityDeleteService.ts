import { SheetManager } from "../../manager/SheetManager";

class EntityDeleteServiceImpl {
  /**
   * Removes entity from google sheets.,
   * @param entity
   */
  delete(entity: any): Promise<void> {
    const pkColumnName = entity.getPrimaryKeyColumn().fieldPropertyName;
    const pkValue = entity[pkColumnName];

    const spreadSheetName = entity.getSpreadsheetName();
    const sheetName = entity.getTableName();

    return SheetManager.delete(spreadSheetName, sheetName, pkColumnName, pkValue);
  }
}

export const EntityDeleteService = new EntityDeleteServiceImpl();
