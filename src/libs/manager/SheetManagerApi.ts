export type GoogleQueryResponse = google.visualization.QueryResponse;
export type GoogleResponse<T> = gapi.client.Response<T>;
export type GoogleAppendValuesResponse = gapi.client.sheets.AppendValuesResponse;

export interface SheetManagerApi {
  findWithoutCriteria(sheet: string): Promise<GoogleQueryResponse>;

  findByCriteria(searchQuery: string, sheet: string): Promise<GoogleQueryResponse>;

  create(rowValues: string[]): Promise<GoogleResponse<GoogleAppendValuesResponse>>;

  delete(spreadSheetId: string, sheetName: string, primaryColumnNumber: string, pkValue: string): Promise<void>;
}
