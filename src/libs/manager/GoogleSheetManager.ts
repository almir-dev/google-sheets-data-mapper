import server from "../../server/server";
import {
  GoogleAppendValuesResponse,
  GoogleQueryResponse,
  GoogleResponse,
  SheetManagerApi,
  SheetResults
} from "./SheetManagerApi";

const { serverFunctions } = server;

class GoogleSheetManagerImpl implements SheetManagerApi {
  create(rowValues: string[]): Promise<GoogleResponse<GoogleAppendValuesResponse>> {
    return Promise.resolve((undefined as unknown) as GoogleResponse<GoogleAppendValuesResponse>);
  }

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
                const bar = response.rows[x].c[y].v;
                return response.rows[x].c[y].v;
              }
            };
          }
        };

        return Promise.resolve(googleResponse);
      })
      .catch((error: any) => console.warn("Failed to fetch sheet data without criteria", error));
  }

  read(range: string): Promise<SheetResults> {
    return Promise.resolve((undefined as unknown) as SheetResults);
  }

  update(values: string[], rangeList: string[]): void {}
}

export const GoogleSheetManager = new GoogleSheetManagerImpl();
