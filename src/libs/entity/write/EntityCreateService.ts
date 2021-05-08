import { SheetManager } from "../../manager/SheetManager";
import { getColumn, getManyToOneColumn } from "../Dto";
import { EntityManager } from "../EntityManager";

class EntityCrateServiceImpl {
  /**
   * Creates a new entity.
   * @param entity entry
   */
  create(entity: any): Promise<any> {
    const values = this.findValuesFromEntity(entity);
    const pk = entity.getPrimaryKeyColumn();
    const pkColumnName = pk.columnId;
    const pkValue = entity[pk.fieldPropertyName];

    const spreadSheetName = entity.getSpreadsheetName();
    const sheetName = entity.getTableName();

    return SheetManager.create(spreadSheetName, sheetName, values, pkColumnName, pkValue);
  }

  /**
   * Retrieves all field values sorted by column names from the given entity.
   * @param entry entry
   * @return list of field property values
   */
  private findValuesFromEntity(entry: any): object[] {
    if (!entry) {
      return [];
    }

    const propertyMap: { [index: string]: object } = {};
    for (const key of Object.keys(entry)) {
      const column = getColumn(entry, key);
      const manyToOneColumn = getManyToOneColumn(entry, key);

      if (column) {
        propertyMap[column.columnId] = entry[key];
      } else if (manyToOneColumn) {
        const referenceEntityPkPropertyKey = entry[key].getPrimaryKeyColumn().fieldPropertyName;
        propertyMap[manyToOneColumn.columnId] = entry[key][referenceEntityPkPropertyKey];
      }
    }

    const sortedColumnIds = Object.keys(propertyMap).sort();
    return sortedColumnIds.map(id => propertyMap[id]);
  }
}

export const EntityCreateService = new EntityCrateServiceImpl();
