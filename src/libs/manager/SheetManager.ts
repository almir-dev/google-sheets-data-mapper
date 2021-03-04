import { PersistenceManager } from "../persistence/PersistenceManager";
import {
  GoogleAppendValuesResponse,
  GoogleQueryResponse,
  GoogleResponse,
  RowResult,
  StandaloneSheetManagerApi,
  SheetResults
} from "./SheetManagerApi";

class SheetManagerImpl implements StandaloneSheetManagerApi {
  private activeSpreadSheetId = "";

  setActiveSheet(activeSpreadSheetId: string) {
    this.activeSpreadSheetId = activeSpreadSheetId;
  }

  read(range: string): Promise<SheetResults> {
    const promise = gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: this.activeSpreadSheetId,
        range
      })
      .then((response: gapi.client.Response<gapi.client.sheets.ValueRange>) => {
        const values: any[][] = response.result.values ? removeFirst(response.result.values) : [[]];

        const rows: RowResult[] = [];
        values.forEach((value, index) => {
          const range = "A" + String(index + 2);
          rows.push({ range, values: value });
        });

        return { rows };
      });

    return Promise.resolve(promise);
  }

  update(values: string[], rangeList: string[]) {
    console.log("WWW updating ...");
    const body = { values: [values] };

    // rangeList.forEach(range => {
    //   gapi.client.sheets.spreadsheets.values
    //       .update({
    //         spreadsheetId: this.activeSpreadSheetId,
    //         range: "A30",
    //         valueInputOption: "RAW",
    //         resource: body
    //       })
    //       .then(
    //           response => {
    //             const result = response.result;
    //             console.log(`WWW ${result.updatedCells} cells updated.`);
    //           },
    //           reason => {
    //             console.log("WWW failed to update because ", reason);
    //           }
    //       );
    // })
    console.log("WWW done ...");
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
}

function removeFirst(input: any[][]) {
  return input.filter((e, index) => index !== 0);
}

export const SheetManager = new SheetManagerImpl();
