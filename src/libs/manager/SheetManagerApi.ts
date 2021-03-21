export type GoogleQueryResponse = google.visualization.QueryResponse;
export type GoogleResponse<T> = gapi.client.Response<T>;
export type GoogleAppendValuesResponse = gapi.client.sheets.AppendValuesResponse;

export interface SheetManagerApi {
  findWithoutCriteria(sheet: string): Promise<GoogleQueryResponse>;

  findByCriteria(searchQuery: string, sheet: string): Promise<GoogleQueryResponse>;

  /**
   * Creates a new row in a sheet.
   * @param spreadSheetId id of the spreadsheet
   * @param sheetName name of the sheet
   * @param values values which will be inserted
   * @param lookupColumnName name of the lookup column to check if there is already a row with the same id
   * @param lookupValue lookup value to check if the sheet has a row with the same id
   */
  create(
    spreadSheetId: string,
    sheetName: string,
    values: object[],
    lookupColumnName: string,
    lookupValue: string
  ): Promise<void>;

  /**
   * Deletes a row in a sheet
   * @param spreadSheetId id of the spreadsheet
   * @param sheetName name of the sheet
   * @param lookupColumnName name of the lookup column
   * @param lookupValue value of the row id which will be deleted
   */
  delete(spreadSheetId: string, sheetName: string, lookupColumnName: string, lookupValue: string): Promise<void>;
}
