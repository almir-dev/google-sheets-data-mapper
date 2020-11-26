import { PersistenceManager } from "./persistence/PersistenceManager";

export type GoogleQueryResponse = google.visualization.QueryResponse;
type GoogleResponse<T> = gapi.client.Response<T>;
type GoogleAppendValuesResponse = gapi.client.sheets.AppendValuesResponse;

interface SheetResults {
  rows: RowResult[];
}

interface RowResult {
  range: string;
  values: any[];
}

class SheetManagerImpl {
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
        const values: any[][] = response.result.values
          ? removeFirst(response.result.values)
          : [[]];

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

  create(
    rowValues: string[]
  ): Promise<GoogleResponse<GoogleAppendValuesResponse>> {
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

  findWithoutCriteria(): Promise<GoogleQueryResponse> {
    const query = new google.visualization.Query(
      PersistenceManager.getActiveSpreadsheetUrl()
    );
    query.setQuery("select * ");

    return new Promise<GoogleQueryResponse>(resolve => {
      query.send(response => {
        resolve(response);
      });
    });
  }

  findByCriteria(searchQuery: string): Promise<GoogleQueryResponse> {
    const query = new google.visualization.Query(
      PersistenceManager.getActiveSpreadsheetUrl()
    );

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
