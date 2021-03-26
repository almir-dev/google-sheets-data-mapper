export type GoogleQueryResponse = google.visualization.QueryResponse;
export type GoogleResponse<T> = gapi.client.Response<T>;
export type GoogleAppendValuesResponse = gapi.client.sheets.AppendValuesResponse;

/**
 * Data needed when updating sheet rows
 * @spreadSheetName name of the spreadSheet
 * @sheetName name of the sheet
 * @lookupColumnName name of the column to search key
 * @updateValue value which will be updated into the sheet
 */
export interface UpdateOperation {
  spreadSheetName: string;
  sheetName: string;
  lookupColumnName: string;
  updateValues: UpdateValue[];
}

/**
 * Update value.
 * @lookupValue lookupValue
 * @values values array
 */
export interface UpdateValue {
  lookupValue: object;
  values: object[];
}

export interface SheetManagerApi {
  /**
   * Searches all values from a sheet.
   * @param spreadSheetName name of the spreadSheet
   * @param sheetName name of sheet
   */
  findWithoutCriteria(spreadSheetName: string, sheetName: string): Promise<GoogleQueryResponse>;

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

  /**
   * Updates rows in sheets based on the update operations.
   * @param updateOperations update operations
   */
  update(updateOperations: UpdateOperation[]): Promise<void>;
}
