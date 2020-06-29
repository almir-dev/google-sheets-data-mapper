enum QueryOperationType {
  EQ = "="
}

enum QueryLogicType {
  NOT = "NOT",
  AND = "AND",
  OR = "OR"
}

interface QueryOperation {
  type: QueryOperationType;
  source: string;
  target: string;
}

interface QueryOperations {
  logic: QueryLogicType;
  operations: QueryOperation[];
}

export type Criteria = QueryOperation | QueryOperations;

export function whereEq(source: string, target: string): QueryOperation {
  return { type: QueryOperationType.EQ, source, target };
}

export function and(...operations: QueryOperation[]): QueryOperations {
  return {
    logic: QueryLogicType.AND,
    operations
  };
}

export function toQueryString(criteria: Criteria) {
  if (isQueryOperation(criteria)) {
    const targetString = `'${criteria.target}'`;
    return (
      "where " + criteria.source + " " + criteria.type + " " + targetString
    );
  }
}

export function isQueryOperation(item: Criteria): item is QueryOperation {
  return !!(item as QueryOperation).type;
}

/* Student.find(Criteria.and(
    Criteria.where("StudentName", "Alice", QueryOperation.EQ),
    Criteria.where("Gender, "Female", QueryOperation.EQ),
)




 */
