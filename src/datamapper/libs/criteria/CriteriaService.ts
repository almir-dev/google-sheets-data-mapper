import { PluralQueryOperation, QueryOperation, SingleQueryOperation } from "./QueryOperation";

interface SheetQuery {
  spreadsheetName: string;
  sheetName: string;
  query: string;
}

interface EntityMeta {
  spreadsheetName: string;
  sheetName: string;
  columnId: string;
}

class CriteriaServiceImpl {
  toQueryString(criteria: QueryOperation) {
    if (this.isQueryOperation(criteria)) {
      return this.singleOperationToQueryString(criteria);
    }

    return this.pluralOperationToQueryString(criteria);
  }

  toSheetQuery(criteria: QueryOperation): SheetQuery[] {
    return [];
  }

  private isPrimitive(input: string): boolean {
    const isString = input === "string";
    const isNumber = input === "number";
    const isDate = input === "date";

    return isString || isNumber || isDate;
  }

  private singleOperationToQueryString(operation: SingleQueryOperation) {
    const targetString = `'${operation.target}'`;
    return operation.source + " " + operation.type + " " + targetString;
  }

  private pluralOperationToQueryString(operations: PluralQueryOperation) {
    let query = "";
    operations.operations.forEach((operation, index) => {
      if (this.isQueryOperation(operation)) {
        query += this.singleOperationToQueryString(operation);
      } else {
        query += this.pluralOperationToQueryString(operation);
      }

      if (index < operations.operations.length - 1) {
        query += " " + operations.logic + " ";
      }
    });

    return "(" + query + ")";
  }

  private isQueryOperation(item: QueryOperation): item is SingleQueryOperation {
    return !!(item as SingleQueryOperation).type;
  }
}

export const CriteriaService = new CriteriaServiceImpl();
