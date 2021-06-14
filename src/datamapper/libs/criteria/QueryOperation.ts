export enum QueryOperationType {
  EQ = "=",
  GT = ">",
  LT = "<",
  LIKE = "LIKE",
  IN = "IN"
}

export enum QueryLogicType {
  NOT = "NOT",
  AND = "AND",
  OR = "OR"
}

export interface SingleQueryOperation {
  type: QueryOperationType;
  source: string;
  target: string | string[];
}

export interface PluralQueryOperation {
  logic: QueryLogicType;
  operations: QueryOperation[];
}

export type QueryOperation = SingleQueryOperation | PluralQueryOperation;

export function whereEq(source: string, target: string): SingleQueryOperation {
  return { type: QueryOperationType.EQ, source, target };
}

export function whereGt(source: string, target: string): SingleQueryOperation {
  return { type: QueryOperationType.GT, source, target };
}

export function whereLt(source: string, target: string): SingleQueryOperation {
  return { type: QueryOperationType.LT, source, target };
}

export function whereLike(source: string, target: string): SingleQueryOperation {
  return { type: QueryOperationType.LIKE, source, target };
}

export function or(...operations: QueryOperation[]): PluralQueryOperation {
  return {
    logic: QueryLogicType.OR,
    operations
  };
}

export function whereIn(source: string, target: string[]): PluralQueryOperation {
  const operations = target.map(element => whereEq(source, element));

  return {
    logic: QueryLogicType.OR,
    operations
  };
}

export function and(...operations: QueryOperation[]): PluralQueryOperation {
  return {
    logic: QueryLogicType.AND,
    operations
  };
}

export function not(...operations: QueryOperation[]): PluralQueryOperation {
  return {
    logic: QueryLogicType.AND,
    operations
  };
}
