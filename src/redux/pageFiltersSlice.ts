import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PageFilter } from 'models';

interface PageFiltersState {
  filters: PageFilter[];
}

const initialState: PageFiltersState = {
  filters: [],
};

const pageFiltersSlice = createSlice({
  name: 'pageFilters',
  initialState,
  reducers: {
    setFilters(
      state,
      action: PayloadAction<{ filters: PageFilter[]; forceNew?: boolean }>,
    ) {
      if (action.payload.forceNew === true) {
        // Clear filters for the specified columns
        const columnsToClear = action.payload.filters.map(
          (filter) => filter.column,
        );
        state.filters = state.filters.filter(
          (filter) => !columnsToClear.includes(filter.column),
        );
      }

      action.payload.filters.forEach((newFilter) => {
        const existingFilter = state.filters.find(
          (filter) => filter.column === newFilter.column,
        );

        if (existingFilter) {
          // Toggle values: add new ones, remove existing ones
          newFilter.values.forEach((value) => {
            const valueIndex = existingFilter.values.indexOf(value);
            if (valueIndex === -1) {
              // Add new value
              existingFilter.values.push(value);
            } else {
              // Remove existing value
              existingFilter.values.splice(valueIndex, 1);
            }
          });

          // Remove the filter entirely if no values remain
          if (existingFilter.values.length === 0) {
            state.filters = state.filters.filter(
              (filter) => filter.column !== newFilter.column,
            );
          }
        } else {
          // Add new filter if no match is found
          state.filters.push(newFilter);
        }
      });
    },
    clearFilters(state) {
      state.filters = [];
    },
  },
});

export const { setFilters, clearFilters } = pageFiltersSlice.actions;
export default pageFiltersSlice.reducer;
