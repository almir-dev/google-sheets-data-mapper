export type SheetResponse = PromiseLike<
  any[][] | Promise<any[][] | undefined> | undefined
>;

interface SheetResults {
  values: any[][];
  header: any[];
}

class SheetManagerImpl {
  private activeSpreadSheetId: string = "";

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
        const header: any[] = response.result.values
          ? response.result.values[0]
          : [];
        const result: SheetResults = { values, header };

        return result;
      });

    return Promise.resolve(promise);
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

  create(rowValues: string[]) {
    console.log("WWW create ...");

    const values = [rowValues];
    const body = { values: values };

    gapi.client.sheets.spreadsheets.values
      .append({
        spreadsheetId: this.activeSpreadSheetId,
        range: "A1",
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        resource: body
      })
      .then(
        response => {
          const result = response.result;
          console.log(`WWW ${result} cells updated.`);
        },
        reason => {
          console.log("WWW failed to update because ", reason);
        }
      );

    console.log("WWW done ...");
  }
}

export const SheetManager = new SheetManagerImpl();

function removeFirst(input: any[][]) {
  return input.filter((e, index) => index !== 0);
}
