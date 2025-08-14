import { Provider, useDispatch, useSelector } from 'react-redux';
import { EmbeddedCard } from 'components/embedded-card';
import { MessageLogger } from 'components/message-logger';
import { PageFiltersManager } from 'components/page-filters-manager';
import { DropdownSelector } from 'components/dropdown-selector';
import store, { RootState } from 'redux/store';
import { usePageFilters } from 'hooks/use-page-filters';
import { setFilters } from 'redux/pageFiltersSlice';
import { addMessage } from 'redux/messagesSlice';
import styles from './index.module.scss';
import { useEffect } from 'react';
import { fetchDropdownOptions } from 'redux/dropdownOptionsSlice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize any necessary state or subscriptions here
    // For example, you might want to fetch initial filters or messages
    dispatch(fetchDropdownOptions());
  }, []);
  const pageFilters = useSelector(
    (state: RootState) => state.pageFilters.filters,
  );
  // Centralized usePageFilters hook
  const [notifyFilterChanges] = usePageFilters(
    (source, filters) => {
      dispatch(setFilters({ filters }));
    },
    (message) => dispatch(addMessage(message)),
  );

  useEffect(() => {
    notifyFilterChanges(pageFilters);
  }, [pageFilters]);

  return (
    <div className={styles.App}>
      <header className={styles.App__header}>
        <h1>Domo Embed Frames Example</h1>
        <p className={styles.App__subtitle}>
          Learn how to embed Domo cards with page filters and postMessage
          communication
        </p>
      </header>

      <main className={styles.App__main}>
        <PageFiltersManager notifyChanges={notifyFilterChanges} />

        <section className={styles.cardSection}>
          <h2>Embedded Domo Card</h2>
          <DropdownSelector />
          <EmbeddedCard
            iframeUrl="https://domo-es.domo.com/embed/card/private/79mz8"
            title="Hero Slicer"
            width={1000}
            height={400}
          />
          <EmbeddedCard
            iframeUrl="https://domo-es.domo.com/embed/card/private/jYjMY"
            title="Class Slicer"
            width={1000}
            height={400}
          />
          <EmbeddedCard
            iframeUrl="https://domo-es.domo.com/embed/card/private/81P2W"
            title="Weekly Points"
            width={1000}
            height={400}
          />
        </section>

        <MessageLogger />
      </main>

      <footer className={styles.App__footer}>
        <div className={styles.links}>
          <a
            className={styles.App__link}
            href="https://developer.domo.com/docs/embedding/embedded-analytics"
            target="_blank"
            rel="noopener noreferrer"
          >
            Domo Embedding Docs
          </a>
          <span> | </span>
          <a
            className={styles.App__link}
            href="https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage"
            target="_blank"
            rel="noopener noreferrer"
          >
            PostMessage API
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
