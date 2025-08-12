import React from 'react';
import logo from './AdvancedAppPlatform.png';
import { Counter } from 'components/counter';
import styles from './index.module.scss';

const App = () => (
  <div className={styles.App}>
    <header className={styles.App__header}>
      <img src={logo} className={styles.App__logo} alt="logo" />
      <h1>Advanced App Platform Package</h1>
      <Counter />
      <span>
        <span>Learn </span>
        <a
          className={styles.App__link}
          href="https://reactjs.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          React
        </a>
        <span>, </span>
        <a
          className={styles.App__link}
          href="https://redux.js.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Redux
        </a>
        <span>, </span>
        <a
          className={styles.App__link}
          href="https://redux-toolkit.js.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Redux Toolkit
        </a>
        ,<span> and </span>
        <a
          className={styles.App__link}
          href="https://react-redux.js.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          React Redux
        </a>
      </span>
    </header>
  </div>
);

export default App;
