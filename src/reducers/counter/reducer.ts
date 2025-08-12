import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import {
  increment,
  decrement,
  incrementByAmount,
  incrementAsyncThunk,
} from './actions';
import { RootState } from '..';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterReducer = createReducer(initialState, (counter) => {
  counter
    .addCase(increment, (state: CounterState) => ({
      ...state,
      value: state.value + 1,
    }))
    .addCase(decrement, (state: CounterState) => ({
      ...state,
      value: state.value - 1,
    }))
    .addCase(
      incrementByAmount,
      (state: CounterState, { payload }: PayloadAction<number>) => ({
        ...state,
        value: state.value + payload,
      }),
    )
    .addCase(
      incrementAsyncThunk.fulfilled,
      (state: CounterState, { payload }: PayloadAction<number>) => ({
        ...state,
        value: state.value + payload,
      }),
    );
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCount = (state: RootState) => state.counter.value;

export default counterReducer;
