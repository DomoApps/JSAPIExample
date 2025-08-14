import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppStudioPageFilter,
  ColumnType,
  DomoMessage,
  PageFilter,
  PageFilterOperator,
} from 'models';
import { useStateRef } from 'hooks/use-state-ref';
import { filtersAreEquals, hasAppStudioTag } from 'utils/functions';

/**
 * Represents a channel with an ID and a message port.
 * @typedef {Object} Channel
 * @property {string} id - The ID of the channel.
 * @property {MessagePort} messagePort - The message port associated with the channel.
 */
type Channel = {
  id: string;
  messagePort: MessagePort;
};

/**
 * Custom hook for managing page filters.
 * @param {string} references - References of the content that is visible.
 * @param {Function} onFilterChange - Callback function to be called when filters change.
 * @param {Function} [setMessages] - Callback to set messages for logging.
 * @returns {Array} - An array containing the current filters and a function to set the current filters.
 */
export const usePageFilters = (
  onFilterChange: (source: string, filters: PageFilter[]) => void,
  setMessages: (messages: DomoMessage) => void,
) => {
  const [currentFilters, setCurrentFilters, ref] = useStateRef<PageFilter[]>(
    [],
  );
  const filterChangeCallback = useRef(onFilterChange);
  const messageCallback = useRef(setMessages);

  const [channels, setChannels] = useState<{ [key: string]: Channel }>({});

  const notifyClients = useCallback((source: string, filters: PageFilter[]) => {
    filterChangeCallback.current(source, filters);
  }, []);

  const recordMessage = useCallback(
    (
      source: string,
      params: Record<string, string>,
      type: string,
      timestamp: number,
    ) => {
      const message: DomoMessage = {
        type,
        data: {
          source,
          params,
        },
        timestamp,
      };
      messageCallback.current(message);
    },
    [setMessages],
  );

  const registerChannel = useCallback(
    (id: string, messagePort: MessagePort) => {
      setChannels((current) => ({
        ...current,
        [id]: {
          id,
          messagePort,
        },
      }));
    },
    [],
  );

  useEffect(() => {
    Object.values(channels).forEach((channel) => {
      const filters = currentFilters.filter((v) => v.source !== channel.id);
      console.log(`Sending filters to channel ${channel.id}:`, filters);
      channel.messagePort.postMessage({
        id: 'setFilters',
        jsonrpc: '2.0',
        method: '/v1/filters/apply',
        params: {
          filters,
        },
      });
    });
  }, [currentFilters, channels]);

  const handler = (connectionEvent: MessageEvent) => {
    if (connectionEvent.ports[0] === undefined) return;
    const referenceId = crypto.randomUUID();
    const messagePort = connectionEvent.ports[0];

    const onPortMessage = (portEvent: MessageEvent) => {
      if (portEvent.data.method !== undefined) {
        switch (portEvent.data.method) {
          case '/v1/onFrameSizeChange':
            recordMessage(
              '/v1/onFrameSizeChange',
              portEvent.data?.params,
              portEvent.data?.method,
              Date.now(),
            );
            break;
          case '/v1/onAppReady':
            recordMessage(
              '/v1/onAppReady',
              portEvent.data?.params,
              portEvent.data?.method,
              Date.now(),
            );
            registerChannel(referenceId, portEvent.target as MessagePort);
            break;
          case '/v1/onFiltersChange':
            recordMessage(
              '/v1/onFiltersChange',
              portEvent.data?.params,
              portEvent.data?.method,
              Date.now(),
            );
            if (hasAppStudioTag(referenceId) === false) {
              console.log('Ignoring standard card event for Filters Change.');
              return;
            }

            const inFiltersOnFilterChange: AppStudioPageFilter[] = portEvent
              .data.params['filters'] as AppStudioPageFilter[];
            if (Array.isArray(inFiltersOnFilterChange) === false) {
              break;
            }

            // Discard echo events
            if (
              // Compares filters with static values only
              filtersAreEquals(
                // The evaluate function takes dynamic filters and convert them into static filters.
                ref.current,
                inFiltersOnFilterChange.filter(
                  ({ values }) => values.length > 0, // App studio sends filter events without values
                ),
              ) === true
            ) {
              break;
            }

            let outFiltersOnFilterChange: PageFilter[] = Object.values(
              inFiltersOnFilterChange.reduce(
                (acc, value) => {
                  const { columnId } = value;
                  let filter: PageFilter | undefined = ref.current?.find(
                    ({ column }) => column === value.columnId,
                  );

                  // Compares filters one by one by taking converting them to static filters first
                  // if they are equal then there is no need to update the filter state in Ares
                  // otherwise, takes the filter from App Studio and applies it to Ares.
                  if (
                    filter === undefined ||
                    filtersAreEquals([filter], [value]) === false
                  ) {
                    const {
                      column,
                      dataType,
                      filterType,
                      label,
                      operand,
                      values,
                      ...payload
                    } = value;
                    filter = {
                      ...(hasAppStudioTag(referenceId) === false && {
                        source: referenceId,
                      }),
                      column: columnId,
                      columnType: column.dataType as ColumnType,
                      dataType,
                      filterType,
                      label,
                      operand,
                      values,
                    };
                  }

                  acc[columnId] = filter;

                  return acc;
                },
                {} as { [key: string]: PageFilter },
              ),
            );

            outFiltersOnFilterChange = [
              ...outFiltersOnFilterChange,
              ...ref.current
                .filter(
                  ({ column }) =>
                    outFiltersOnFilterChange.findIndex(
                      (value) => value.column === column,
                    ) === -1,
                )
                .map((filter) => ({ ...filter, values: [] })),
            ];
            notifyClients(referenceId, outFiltersOnFilterChange);
            break;
          case '/v1/onDrill':
            recordMessage(
              '/v1/onDrill',
              portEvent.data?.params,
              portEvent.data?.method,
              Date.now(),
            );
            if (hasAppStudioTag(referenceId) === true) {
              console.log('Ignoring App Studio event for Drill.');
              return;
            }
            const inFiltersOnDrill: PageFilter[] =
              portEvent.data.params['filters'];
            if (Array.isArray(inFiltersOnDrill) === false) {
              return;
            }
            const outFiltersOnDrill = Object.values(
              inFiltersOnDrill.reduce(
                (acc, value) => {
                  const { dataSourceId, ...payload } = value;
                  acc[payload.column] = {
                    ...payload,
                    ...(hasAppStudioTag(referenceId) === false && {
                      source: referenceId,
                    }),
                    operand: PageFilterOperator.In,
                  } as PageFilter;

                  return acc;
                },
                {} as { [key: string]: PageFilter },
              ),
            );
            notifyClients(referenceId, outFiltersOnDrill);
            break;
          default:
            console.log('Unhandled Port Event method:', portEvent.data.method);
        }
      }
    };

    messagePort.onmessage = onPortMessage;
    messagePort.start();

    if (hasAppStudioTag(referenceId) === false) {
      // App studio apps won't be registered until the 'onAppReady' event arrives.
      registerChannel(referenceId, messagePort);
    }
  };

  useEffect(() => {
    filterChangeCallback.current = onFilterChange;
  }, [onFilterChange]);

  useEffect(() => {
    window.addEventListener('message', handler);

    // Cleanup Function
    return () => {
      window.removeEventListener('message', handler);
    };
  }, []);

  const notify = useCallback((value: PageFilter[]) => {
    console.log('Setting filters:', value);
    setCurrentFilters(value);
  }, []);

  return [notify] as const;
};
