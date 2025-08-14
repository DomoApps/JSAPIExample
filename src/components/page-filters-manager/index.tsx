import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import {
  ColumnType,
  PageFilter,
  PageFilterDataType,
  PageFilterOperator,
} from 'models';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

const channels: Record<
  string,
  {
    referenceId: string;
    messagePort: MessagePort;
  }
> = {};

const applyFiltersToFrames = (filters: PageFilter[]) => {
  Object.values(channels).forEach((channel) => {
    channel.messagePort.postMessage({
      id: 'setFilters',
      jsonrpc: '2.0',
      method: '/v1/filters/apply',
      params: { filters },
    });
  });
};

interface Props {
  notifyChanges: (filters: PageFilter[]) => void;
}

export const PageFiltersManager: React.FC<Props> = (props: Props) => {
  const selectedClass = useSelector(
    (state: RootState) => state.dropdownOptions.currentSelected,
  );

  const handleApplyFilter = () => {
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
    props.notifyChanges([newFilter]);
  };
  useEffect(() => {
    const newFilter: PageFilter = {
      column: 'Talent_Class',
      columnType: ColumnType.STRING,
      dataType: PageFilterDataType.String,
      label: 'Talent Class',
      operand: PageFilterOperator.In,
      values: [selectedClass === null ? '' : selectedClass],
    };
    props.notifyChanges([newFilter]);
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
