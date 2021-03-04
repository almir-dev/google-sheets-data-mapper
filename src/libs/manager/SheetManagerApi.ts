export type GoogleQueryResponse = google.visualization.QueryResponse;
export type GoogleResponse<T> = gapi.client.Response<T>;
export type GoogleAppendValuesResponse = gapi.client.sheets.AppendValuesResponse;

export interface RowResult {
  range: string;
  values: any[];
}

export interface SheetResults {
  rows: RowResult[];
}

export interface SheetManagerApi {
  read(range: string): Promise<SheetResults>;

  update(values: string[], rangeList: string[]): void;

  create(rowValues: string[]): Promise<GoogleResponse<GoogleAppendValuesResponse>>;

  findWithoutCriteria(sheet: string): Promise<GoogleQueryResponse>;

  findByCriteria(searchQuery: string, sheet: string): Promise<GoogleQueryResponse>;
}
