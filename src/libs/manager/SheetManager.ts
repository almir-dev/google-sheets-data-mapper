import {
  GoogleAppendValuesResponse,
  GoogleQueryResponse,
  GoogleResponse,
  SheetManagerApi,
  SheetResults
} from "./SheetManagerApi";
import { GoogleSheetManager } from "./GoogleSheetManager";
import { StandaloneSheetManager } from "./StandaloneSheetManager";

class SheetManagerImpl implements SheetManagerApi {
  private readonly activeSheetManager: SheetManagerApi;

  constructor() {
    this.activeSheetManager = this.isProdEnv() ? GoogleSheetManager : StandaloneSheetManager;
  }

  create(rowValues: string[]): Promise<GoogleResponse<GoogleAppendValuesResponse>> {
    return this.activeSheetManager.create(rowValues);
  }

  findByCriteria(searchQuery: string, sheet: string): Promise<GoogleQueryResponse> {
    return this.activeSheetManager.findByCriteria(searchQuery, sheet);
  }

  findWithoutCriteria(sheet: string): Promise<GoogleQueryResponse> {
    return this.activeSheetManager.findWithoutCriteria(sheet);
  }

  read(range: string): Promise<SheetResults> {
    return this.activeSheetManager.read(range);
  }

  update(values: string[], rangeList: string[]): void {}

  private isProdEnv(): boolean {
    return process.env.NODE_ENV === "production";
  }
}

export const SheetManager = new SheetManagerImpl();
