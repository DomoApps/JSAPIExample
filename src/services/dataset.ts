import Query, { OrderByDirection } from '@domoinc/query';
import { DATASET_ALIAS } from 'constants/index';

const getDropdownOptions = async (): Promise<string[]> => {
  const query = new Query();
  const ret: Record<string, string>[] = await query
    .select(['Talent_Class'])
    .groupBy(['Talent_Class'])
    .orderBy('Talent_Class', OrderByDirection.DESCENDING)
    .fetch(DATASET_ALIAS.livingLegend);

  return ret.map((item) => item['Talent_Class']); // Map results to string[]
};
export const datasetService = {
  getDropdownOptions,
};
