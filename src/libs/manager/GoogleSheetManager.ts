import {
  GoogleAppendValuesResponse,
  GoogleQueryResponse,
  GoogleResponse, SheetResults,
  StandaloneSheetManagerApi
} from "./StandaloneSheetManagerApi";


class GoogleSheetManagerImpl implements StandaloneSheetManagerApi {
  create(rowValues: string[]): Promise<GoogleResponse<GoogleAppendValuesResponse>> {
    return Promise.resolve((undefined as unknown) as GoogleResponse<GoogleAppendValuesResponse>);
  }

  findByCriteria(searchQuery: string, sheet: string): Promise<GoogleQueryResponse> {
    return Promise.resolve((undefined as unknown) as GoogleQueryResponse);
  }

  findWithoutCriteria(sheet: string): Promise<GoogleQueryResponse> {
    return Promise.resolve((undefined as unknown) as GoogleQueryResponse);
  }

  read(range: string): Promise<SheetResults> {
    return Promise.resolve((undefined as unknown) as SheetResults);
  }

  update(values: string[], rangeList: string[]): void {}
}

export const GoogleSheetManager = new GoogleSheetManagerImpl();
