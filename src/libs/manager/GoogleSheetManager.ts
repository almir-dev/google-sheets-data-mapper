import server from "../../server/server";
import { GoogleQueryResponse, SheetManagerApi } from "./SheetManagerApi";

class GoogleSheetManagerImpl implements SheetManagerApi {
  private readonly serverFunctions = server.serverFunctions;

  findByCriteria(searchQuery: string, sheet: string): Promise<GoogleQueryResponse> {
    return Promise.resolve((undefined as unknown) as GoogleQueryResponse);
  }

  findWithoutCriteria(sheet: string): Promise<GoogleQueryResponse> {
    return this.serverFunctions
      .findWithoutCriteria()
      .then((response: any) => {
        const googleResponse = {
          getDataTable: () => {
            return {
              getNumberOfRows: () => response.rows.length,
              getNumberOfColumns: () => response.cols.length,
              getValue: (x: number, y: number) => {
                return response.rows[x].c[y].v;
              }
            };
          }
        };

        return Promise.resolve(googleResponse);
      })
      .catch((error: any) => console.log("Failed to fetch sheet data without criteria", error));
  }

  create(
    spreadSheetId: string,
    sheetName: string,
    values: object[],
    lookupColumnName: string,
    lookupValue: string
  ): Promise<void> {
    return this.serverFunctions
      .createSheetRow(spreadSheetId, sheetName, values, lookupColumnName, lookupValue)
      .then((response: { errorMessage?: string }) => {
        if (response?.errorMessage) {
          console.log(response.errorMessage);
          return Promise.reject();
        }
      });
  }

  delete(spreadSheetId: string, sheetName: string, lookupColumnName: string, lookupValue: string): Promise<void> {
    return this.serverFunctions
      .deleteSheetRow(spreadSheetId, sheetName, lookupColumnName, lookupValue)
      .catch((error: any) => console.log("Failed to delete row entry", error));
  }
}

export const GoogleSheetManager = new GoogleSheetManagerImpl();
