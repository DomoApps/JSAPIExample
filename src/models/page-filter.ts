export enum PageFilterDataType {
  String = 'string',
  Numeric = 'numeric',
  Date = 'date',
  Datetime = 'datetime',
}

/**
 * Enum representing the column types for a data table.
 */
export enum ColumnType {
  STRING = 'STRING',
  DOUBLE = 'DOUBLE',
  DATE = 'DATE',
  LONG = 'LONG',
}

/**
 * Enumeration of page filter operands.
 * @enum {string}
 * @property {string} In - Represents the "IN" operand.
 * @property {string} NotIn - Represents the "NOT_IN" operand.
 * @property {string} GreaterThan - Represents the "GREATER_THAN" operand.
 * @property {string} GreatThanEqualsTo - Represents the "GREAT_THAN_EQUALS_TO" operand.
 * @property {string} LessThan - Represents the "LESS_THAN" operand.
 * @property {string} LessThanEqualsTo - Represents the "LESS_THAN_EQUALS_TO" operand.
 * @property {string} Between - Represents the "BETWEEN" operand.
 * @property {string} Equals - Represents the "EQUALS" operand.
 * @property {string} NotEquals - Represents the "NOT_EQUALS" operand.
 */
export enum PageFilterOperator {
  In = 'IN',
  NotIn = 'NOT_IN',
  GreaterThan = 'GREATER_THAN',
  GreatThanEqualsTo = 'GREAT_THAN_EQUALS_TO',
  LessThan = 'LESS_THAN',
  LessThanEqualsTo = 'LESS_THAN_EQUALS_TO',
  Between = 'BETWEEN',
  Equals = 'EQUALS',
  NotEquals = 'NOT_EQUALS',
  // not supported yet
  // Contains = 'LIKE',
}

/**
 * Represents a filter applied to a page.
 * @typedef {Object} PageFilter
 * @property {string} [source] - The source of the filter.
 * @property {string} column - The column to filter on.
 * @property {ColumnType} columnType - The type of the column.
 * @property {string} [dataSourceId] - The ID of the data source.
 * @property {PageFilterType} dataType - The data type of the filter.
 * @property {string} [filterType] - The type of the filter.
 * @property {string} label - The label of the filter.
 * @property {PageFilterOperand} operand - The operand of the filter.
 * @property {string[]} values - The values of the filter.
 */
export type PageFilter = {
  source?: string;
  column: string;
  columnType: ColumnType;
  dataSourceId?: string;
  dataType: PageFilterDataType;
  filterType?: string;
  label: string;
  operand: PageFilterOperator;
  values: string[];
  isViewFilter?: boolean;
};

export type AppStudioPageFilter = {
  column: {
    dataType: string;
  };
  columnId: string;
  datasources: any[];
  dataType: PageFilterDataType;
  filterType?: string;
  label: string;
  operand: PageFilterOperator;
  values: string[];
  sourceCardURN?: string;
};

export const PageFilterOperatorsLabels: {
  [key in PageFilterOperator]: string;
} = {
  IN: 'In',
  NOT_IN: 'Not In',
  GREATER_THAN: 'Greater than',
  GREAT_THAN_EQUALS_TO: 'Greater than or Equal to',
  LESS_THAN: 'Less than',
  LESS_THAN_EQUALS_TO: 'Less than or Equal to',
  BETWEEN: 'Between',
  EQUALS: 'Equals',
  NOT_EQUALS: 'Not equal',
  // not supported yet
  // LIKE: 'Contains',
};

const CommonPageFilterOperators = [
  PageFilterOperator.In,
  PageFilterOperator.NotIn,
];

export const PageFilterOperatorsByDataType: {
  [key in PageFilterDataType]: {
    default: PageFilterOperator;
    operators: PageFilterOperator[];
  };
} = {
  [PageFilterDataType.String]: {
    default: PageFilterOperator.In,
    operators: [
      ...CommonPageFilterOperators,
      PageFilterOperator.Equals,
      PageFilterOperator.NotEquals,
      // not supported yet
      // PageFilterOperator.Contains,
    ],
  },
  [PageFilterDataType.Numeric]: {
    default: PageFilterOperator.In,
    operators: [
      ...CommonPageFilterOperators,
      PageFilterOperator.GreaterThan,
      PageFilterOperator.GreatThanEqualsTo,
      PageFilterOperator.LessThan,
      PageFilterOperator.LessThanEqualsTo,
      PageFilterOperator.Between,
      PageFilterOperator.Equals,
      PageFilterOperator.NotEquals,
    ],
  },
  [PageFilterDataType.Date]: {
    default: PageFilterOperator.In,
    operators: [
      ...CommonPageFilterOperators,
      PageFilterOperator.GreaterThan,
      PageFilterOperator.GreatThanEqualsTo,
      PageFilterOperator.LessThan,
      PageFilterOperator.LessThanEqualsTo,
      PageFilterOperator.Between,
      PageFilterOperator.Equals,
      PageFilterOperator.NotEquals,
    ],
  },
  [PageFilterDataType.Datetime]: {
    default: PageFilterOperator.In,
    operators: [
      ...CommonPageFilterOperators,
      PageFilterOperator.GreaterThan,
      PageFilterOperator.GreatThanEqualsTo,
      PageFilterOperator.LessThan,
      PageFilterOperator.LessThanEqualsTo,
      PageFilterOperator.Between,
      PageFilterOperator.Equals,
      PageFilterOperator.NotEquals,
    ],
  },
};

/**
 * Represents the sorting configuration for a page.
 * @typedef {Object} PageSort
 * @property {string} column - The column to sort by.
 * @property {'ASC' | 'DESC'} order - The sort order, either 'ASC' (ascending) or 'DESC' (descending).
 */
export type PageSort = {
  name: string;
  direction: 'ASC' | 'DESC';
};
