import { PersistenceManager } from "./persistence/PersistenceManager";

type GoogleQueryResponse = google.visualization.QueryResponse;
type GoogleResponse<T> = gapi.client.Response<T>;
type GoogleAppendValuesResponse = gapi.client.sheets.AppendValuesResponse;

class SheetManagerImpl {
  private activeSpreadSheetId: string = "";

  setActiveSheet(activeSpreadSheetId: string) {
    this.activeSpreadSheetId = activeSpreadSheetId;
  }

  update() {
    console.log("WWW updating ...");

    const values = [
      ["Jack", "Male", "4.Senior", "NY", "Computer Science", "Football"]
    ];
    const body = {
      values: values
    };
    gapi.client.sheets.spreadsheets.values
      .update({
        spreadsheetId: this.activeSpreadSheetId,
        range: "A30",
        valueInputOption: "RAW",
        resource: body
      })
      .then(
        response => {
          const result = response.result;
          console.log(`WWW ${result.updatedCells} cells updated.`);
        },
        reason => {
          console.log("WWW failed to update because ", reason);
        }
      );

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

export const SheetManager = new SheetManagerImpl();
