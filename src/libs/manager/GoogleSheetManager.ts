import server from "../../server/server";
import { GoogleQueryResponse, SheetManagerApi, UpdateOperation } from "./SheetManagerApi";

class GoogleSheetManagerImpl implements SheetManagerApi {
  private readonly serverFunctions = server.serverFunctions;

  findByCriteria(searchQuery: string, sheet: string): Promise<GoogleQueryResponse> {
    return Promise.resolve((undefined as unknown) as GoogleQueryResponse);
  }

  findWithoutCriteria(spreadSheetName: string, sheetName: string): Promise<GoogleQueryResponse> {
    return this.serverFunctions
      .findWithoutCriteria(spreadSheetName, sheetName)
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
    spreadSheetName: string,
    sheetName: string,
    values: object[],
    lookupColumnName: string,
    lookupValue: string
  ): Promise<void> {
    return this.serverFunctions
      .createSheetRow(spreadSheetName, sheetName, values, lookupColumnName, lookupValue)
      .then((response: { errorMessage?: string }) => {
        if (response?.errorMessage) {
          console.log(response.errorMessage);
          return Promise.reject();
        }
      });
  }

  delete(spreadSheetName: string, sheetName: string, lookupColumnName: string, lookupValue: string): Promise<void> {
    return this.serverFunctions
      .deleteSheetRow(spreadSheetName, sheetName, lookupColumnName, lookupValue)
      .catch((error: any) => console.log("Failed to delete row entry", error));
  }

  update(updateOperations: UpdateOperation[]): Promise<void> {
    return this.serverFunctions.updateManySheetRows(updateOperations);
  }
}

export const GoogleSheetManager = new GoogleSheetManagerImpl();
