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
    setFilters(state, action: PayloadAction<{ filters: PageFilter[] }>) {
      action.payload.filters.forEach((newFilter) => {
        const existingFilter = state.filters.find(
          (filter) => filter.column === newFilter.column,
        );

        if (existingFilter) {
          // Combine and deduplicate values
          existingFilter.values = Array.from(
            new Set([...existingFilter.values, ...newFilter.values]),
          );
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
