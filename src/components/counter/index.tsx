import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCount } from 'reducers/counter/reducer';
import {
  increment,
  decrement,
  incrementByAmount,
  incrementAsync,
  incrementAsyncThunk,
} from 'reducers/counter/actions';
import styles from './index.module.scss';

export const Counter = () => {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() =>
            dispatch(
              incrementByAmount(
                !Number.isNaN(Number(incrementAmount))
                  ? Number(incrementAmount)
                  : 0,
              ),
            )
          }
        >
          Add Amount
        </button>
        <button
          className={styles.asyncButton}
          onClick={() =>
            dispatch(
              incrementAsync(
                !Number.isNaN(Number(incrementAmount))
                  ? Number(incrementAmount)
                  : 0,
              ),
            )
          }
        >
          Add Async
        </button>
        <button
          className={styles.asyncButton}
          onClick={() =>
            dispatch(
              incrementAsyncThunk(
                !Number.isNaN(Number(incrementAmount))
                  ? Number(incrementAmount)
                  : 0,
              ),
            )
          }
        >
          Add Async Thunk
        </button>
      </div>
    </div>
  );
};
