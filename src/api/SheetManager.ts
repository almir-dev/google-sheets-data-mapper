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
}

export const SheetManager = new SheetManagerImpl();

function removeFirst(input: any[][]) {
  return input.filter((e, index) => index !== 0);
}
