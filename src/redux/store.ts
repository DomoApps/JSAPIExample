import { configureStore } from '@reduxjs/toolkit';
import pageFiltersReducer from './pageFiltersSlice';
import messagesReducer from './messagesSlice';
import dropdownOptionsReducer from './dropdownOptionsSlice';

const store = configureStore({
  reducer: {
    pageFilters: pageFiltersReducer,
    messages: messagesReducer, // Add messages reducer
    dropdownOptions: dropdownOptionsReducer, // Add dropdown options reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
