import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import {
  ColumnType,
  PageFilter,
  PageFilterDataType,
  PageFilterOperator,
} from 'models';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { setFilters } from 'redux/pageFiltersSlice';

interface Props {
  notifyChanges: (filters: PageFilter[]) => void;
}

export const PageFiltersManager: React.FC<Props> = (props: Props) => {
  const dispatch = useDispatch();
  const selectedClass = useSelector(
    (state: RootState) => state.dropdownOptions.currentSelected,
  );

  const handleApplyFilter = () => {
    // TODO: Please update this to match filters you want to apply
    // This is just an example filter based on the selected class
    const newFilter: PageFilter = {
      column: 'Talent_Class',
      columnType: ColumnType.STRING,
      dataType: PageFilterDataType.String,
      label: 'Talent Class',
      operand: PageFilterOperator.In,
      values: [
        'Elemental Ranger',
        'Wizard',
        'Shadow Brute',
        'Brute',
        'Light Illusionist',
      ],
    };
    dispatch(setFilters({ filters: [newFilter] }));
  };
  useEffect(() => {
    if (selectedClass === null) {
      return;
    }
    // TODO: Please update this to match filters you want to apply
    // This is just an example filter based on the selected class
    const newFilter: PageFilter = {
      column: 'Talent_Class',
      columnType: ColumnType.STRING,
      dataType: PageFilterDataType.String,
      label: 'Talent Class',
      operand: PageFilterOperator.In,
      values: [selectedClass],
    };
    dispatch(setFilters({ filters: [newFilter] }));
  }, [selectedClass]);

  return (
    <div className={styles.pageFiltersManager}>
      <h2>Page Filters Manager</h2>
      <button onClick={handleApplyFilter} className={styles.applyButton}>
        Apply Filter
      </button>
    </div>
  );
};
