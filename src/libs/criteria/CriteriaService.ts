import {
  QueryOperation,
  SingleQueryOperation,
  PluralQueryOperation
} from "./QueryOperation";

class CriteriaServiceImpl {
  toQueryString(criteria: QueryOperation) {
    if (this.isQueryOperation(criteria)) {
      return this.singleOperationToQueryString(criteria);
    }

    return this.pluralOperationToQueryString(criteria);
  }

  private singleOperationToQueryString(operation: SingleQueryOperation) {
    console.log("WWW boo", operation);
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
