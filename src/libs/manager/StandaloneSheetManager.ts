import { PersistenceManager } from "../persistence/PersistenceManager";
import { GoogleAppendValuesResponse, GoogleQueryResponse, GoogleResponse, SheetManagerApi } from "./SheetManagerApi";

class SheetManagerImpl implements SheetManagerApi {
  private activeSpreadSheetId = "";

  setActiveSheet(activeSpreadSheetId: string) {
    this.activeSpreadSheetId = activeSpreadSheetId;
  }

  findWithoutCriteria(sheet: string): Promise<GoogleQueryResponse> {
    const request = PersistenceManager.getActiveSpreadsheetUrl();
    const selectQuery = encodeURIComponent("select * ");
    const sheetQuery = "sheet=" + sheet;

    const dataSourceUrl = request + "&" + selectQuery + "&" + sheetQuery;

    const query = new google.visualization.Query(dataSourceUrl);

    return new Promise<GoogleQueryResponse>(resolve => {
      query.send(response => {
        resolve(response);
      });
    });
  }

  findByCriteria(searchQuery: string, sheet: string): Promise<GoogleQueryResponse> {
    const request = PersistenceManager.getActiveSpreadsheetUrl();
    const sheetQuery = "sheet=" + sheet;

    const dataSourceUrl = request + "&" + sheetQuery;
    const query = new google.visualization.Query(dataSourceUrl);
    query.setQuery("select * where " + searchQuery);

    return new Promise<GoogleQueryResponse>(resolve => {
      query.send(response => {
        resolve(response);
      });
    });
  }

  create(rowValues: string[]): Promise<GoogleResponse<GoogleAppendValuesResponse>> {
    const values = [rowValues];
    const resource = { values: values };

    const request = {
      spreadsheetId: this.activeSpreadSheetId,
      range: "A1",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource
    };

    return new Promise<GoogleResponse<GoogleAppendValuesResponse>>(resolve => {
      gapi.client.sheets.spreadsheets.values.append(request).then(response => {
        const result = response.result;
        resolve(response);
      });
    });
  }

  delete(spreadSheetId: string, sheetName: string, primaryColumnNumber: number, pkValue: string): Promise<void> {
    throw new Error("Delete method not yet implemented!");
  }
}

export const StandaloneSheetManager = new SheetManagerImpl();
