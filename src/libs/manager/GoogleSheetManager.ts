import server from "../../server/server";
import { GoogleAppendValuesResponse, GoogleQueryResponse, GoogleResponse, SheetManagerApi } from "./SheetManagerApi";

const { serverFunctions } = server;

class GoogleSheetManagerImpl implements SheetManagerApi {
  findByCriteria(searchQuery: string, sheet: string): Promise<GoogleQueryResponse> {
    return Promise.resolve((undefined as unknown) as GoogleQueryResponse);
  }

  findWithoutCriteria(sheet: string): Promise<GoogleQueryResponse> {
    return serverFunctions
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
      .catch((error: any) => console.warn("Failed to fetch sheet data without criteria", error));
  }

  create(rowValues: string[]): Promise<GoogleResponse<GoogleAppendValuesResponse>> {
    return Promise.resolve((undefined as unknown) as GoogleResponse<GoogleAppendValuesResponse>);
  }

  delete(spreadSheetId: string, sheetName: string, columnName: string, pkValue: string): Promise<void> {
    return serverFunctions
      .deleteSheetRow(spreadSheetId, sheetName, columnName, pkValue)
      .then(() => {
        return Promise.resolve();
      })
      .catch((error: any) => console.warn("Failed to fetch sheet data without criteria", error));
  }
}

export const GoogleSheetManager = new GoogleSheetManagerImpl();
