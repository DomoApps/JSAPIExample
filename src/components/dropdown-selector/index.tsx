import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/store';
import { setCurrentSelected } from 'redux/dropdownOptionsSlice';
import styles from './index.module.scss';
import { setFilters } from 'redux/pageFiltersSlice';
import { createFilter } from 'utils/functions';
import { ClientsDataset } from 'models';

export const DropdownSelector: FC<{ columnKey: string }> = ({ columnKey }) => {
  const options = useSelector(
    (state: RootState) => state.dropdownOptions.options,
  );
  const currentSelected = useSelector((state: RootState) =>
    state.dropdownOptions.currentSelected[columnKey] === undefined
      ? null
      : state.dropdownOptions.currentSelected[columnKey],
  );
  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCurrentSelected({ columnKey, value: event.target.value }));
    const newFilter = createFilter(
      columnKey,
      ClientsDataset[columnKey],
      event.target.value,
    );
    dispatch(setFilters({ filters: [newFilter], forceNew: true }));
  };

  return (
    <div className={styles.DropdownSelector}>
      <label htmlFor={`dropdown-${columnKey}`} className={styles.label}>
        {columnKey
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())}
      </label>
      <select
        id={`dropdown-${columnKey}`}
        className={styles.dropdown}
        value={currentSelected !== null ? currentSelected : ''}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options[columnKey]?.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
