import { APP_STUDIO_TAG } from 'constants/index';
import { AppStudioPageFilter, PageFilter } from 'models';

export const hasAppStudioTag = (value: string) =>
  value.toUpperCase().endsWith(`${APP_STUDIO_TAG}`);

export const filtersAreEquals = (
  currentState: PageFilter[],
  newState: AppStudioPageFilter[],
) => {
  if (currentState.length === 0 && newState.length === 0) {
    return true;
  }

  if (
    currentState.length === 0 &&
    newState.length > 0 &&
    newState.reduce((acc, { values }) => acc + values.length, 0) === 0 // app studio sends filters without values
  ) {
    return true;
  }

  if (currentState.length !== newState.length) {
    return false;
  }

  const areEqual = currentState.some(
    ({ column, operand, values }) =>
      newState.findIndex(
        (newFilter) =>
          newFilter.columnId === column &&
          (newFilter.operand !== operand ||
            JSON.stringify(newFilter.values) !== JSON.stringify(values)),
      ) === -1,
  );

  return areEqual; // if there is a difference in the filters
};
