import Query, { OrderByDirection } from '@domoinc/query';
import { DATASET_ALIAS } from 'constants/index';
import { ClientsDataset, DropdownOptions } from 'models';

const getDropdownOptions = async (): Promise<Record<string, string[]>> => {
  const columnValuesPromises = getDropdownColumns().map(async (columnKey) => {
    const values = await getColumnValues(columnKey);
    return { [columnKey]: values };
  });

  const allValuesArray = await Promise.all(columnValuesPromises);

  // Combine all column values into a single object
  return allValuesArray.reduce(
    (acc, columnObj) => ({ ...acc, ...columnObj }),
    {},
  );
};

const getColumnValues = async (columnKey: string): Promise<string[]> => {
  if (!columnKey) {
    throw new Error(
      `Column key '${columnKey}' does not exist in ClientsDataset.`,
    );
  }

  const query = new Query();
  const ret: Record<string, string>[] = await query
    .select([columnKey])
    .groupBy([columnKey])
    .orderBy(columnKey, OrderByDirection.ASCENDING)
    .fetch(DATASET_ALIAS.clients);

  return ret
    .map((item) => item[columnKey])
    .filter((value, index, array) => array.indexOf(value) === index);
};

const getAllColumns = (): string[] => Object.keys(ClientsDataset);
const getDropdownColumns = (): string[] => Object.keys(DropdownOptions);

export const datasetService = {
  getDropdownOptions,
  getColumnValues,
  getAllColumns,
  getDropdownColumns,
};
