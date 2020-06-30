export enum QueryOperationType {
  EQ = "="
}

export enum QueryLogicType {
  NOT = "NOT",
  AND = "AND",
  OR = "OR"
}

export interface SingleQueryOperation {
  type: QueryOperationType;
  source: string;
  target: string;
}

export interface PluralQueryOperation {
  logic: QueryLogicType;
  operations: QueryOperation[];
}

export type QueryOperation = SingleQueryOperation | PluralQueryOperation;

export function whereEq(source: string, target: string): SingleQueryOperation {
  return { type: QueryOperationType.EQ, source, target };
}

export function or(...operations: QueryOperation[]): PluralQueryOperation {
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
