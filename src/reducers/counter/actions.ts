import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppThunk } from '..';

export const increment = createAction('INCREMENT');
export const decrement = createAction('DECREMENT');
export const incrementByAmount = createAction<number>('INCREMENT_BY_AMOUNT');

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const incrementAsync =
  (amount: number): AppThunk =>
  (dispatch) => {
    setTimeout(() => {
      dispatch(incrementByAmount(amount));
    }, 1000);
  };

// The function below is also a thunk, but uses the createAsyncThunk helper
// function from redux-toolkit. It can be dispatched like a regular action.
// For documentation on how to use this method, as well as details about
// the `thunkAPI` parameter, see https://redux-toolkit.js.org/api/createAsyncThunk
export const incrementAsyncThunk = createAsyncThunk(
  'INCREMENT_THUNK',
  async (amount: number, thunkAPI) =>
    await new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        resolve(amount);
      }, 1000);
    }),
);
