import React from 'react';
import styles from './index.module.scss';
import { DropdownOptions } from 'models';
import { DropdownSelector } from 'components/dropdown-selector';

export const PageFiltersManager: React.FC = () => (
  <div className={styles.pageFiltersManager}>
    <h2>Page Filters Manager</h2>
    {Object.keys(DropdownOptions).map((column) => (
      <DropdownSelector key={column} columnKey={column} />
    ))}
  </div>
);
