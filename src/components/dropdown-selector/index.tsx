import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/store';
import { setCurrentSelected } from 'redux/dropdownOptionsSlice';
import styles from './index.module.scss';

export const DropdownSelector: FC = () => {
  const options = useSelector(
    (state: RootState) => state.dropdownOptions.options,
  );
  const currentSelected = useSelector(
    (state: RootState) => state.dropdownOptions.currentSelected,
  );
  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCurrentSelected(event.target.value));
  };

  return (
    <div className={styles.DropdownSelector}>
      <select
        className={styles.dropdown}
        value={currentSelected !== null ? currentSelected : ''}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
