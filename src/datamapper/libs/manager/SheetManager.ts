import { GoogleQueryResponse, SheetManagerApi, UpdateOperation } from "./SheetManagerApi";
import { GoogleSheetManager } from "./GoogleSheetManager";

class SheetManagerImpl implements SheetManagerApi {
  private readonly activeSheetManager?: SheetManagerApi;

  constructor() {
    this.activeSheetManager = this.isProdEnv() ? GoogleSheetManager : undefined;
  }

  findByCriteria(query: string, spreadsheetName: string, sheetName: string): Promise<GoogleQueryResponse> {
    if (!this.activeSheetManager) {
      throw new Error("Cant use sheet manager locally ");
    }
    return this.activeSheetManager.findByCriteria(query, spreadsheetName, sheetName);
  }

  findWithoutCriteria(spreadSheetName: string, sheetName: string): Promise<GoogleQueryResponse> {
    if (!this.activeSheetManager) {
      throw new Error("Cant use sheet manager locally ");
    }
    return this.activeSheetManager.findWithoutCriteria(spreadSheetName, sheetName);
  }

  create(
    spreadSheetId: string,
    sheetName: string,
    value: object[],
    pkColumnName: string,
    pkValue: string
  ): Promise<void> {
    if (!this.activeSheetManager) {
      throw new Error("Cant use sheet manager locally ");
    }
    return this.activeSheetManager.create(spreadSheetId, sheetName, value, pkColumnName, pkValue);
  }

  delete(spreadSheetId: string, sheetName: string, columnName: string, pkValue: string): Promise<void> {
    if (!this.activeSheetManager) {
      throw new Error("Cant use sheet manager locally ");
    }
    return this.activeSheetManager.delete(spreadSheetId, sheetName, columnName, pkValue);
  }

  update(updateOperations: UpdateOperation[]): Promise<void> {
    if (!this.activeSheetManager) {
      throw new Error("Cant use sheet manager locally ");
    }

    return this.activeSheetManager.update(updateOperations);
  }

  private isProdEnv(): boolean {
    return process.env.NODE_ENV === "production";
  }
}

export const SheetManager = new SheetManagerImpl();
