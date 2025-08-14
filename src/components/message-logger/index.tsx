import React, { useEffect, useRef } from 'react';
import styles from './index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { clearMessages } from 'redux/messagesSlice';

interface DomoMessage {
  type: string;
  data?: any;
  timestamp?: number;
}

interface MessageLoggerProps {
  maxMessages?: number;
}

export const MessageLogger: React.FC<MessageLoggerProps> = ({
  maxMessages = 100,
}) => {
  const logRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.messages.messages);
  // Auto-scroll to top when new messages arrive
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 0; // Scroll to the top instead of the bottom
    }
  }, [messages]);

  const formatTimestamp = (timestamp?: number) => {
    if (timestamp === undefined || timestamp === null) return '';
    return new Date(timestamp).toLocaleDateString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3, // Include milliseconds
      hour12: true,
    });
  };

  const formatMessageData = (data: any) => {
    if (typeof data === 'string') return data;
    if (data === null || data === undefined) return '';
    return JSON.stringify(data, null, 2);
  };

  const getMessageTypeClass = (type: string) => {
    if (type === 'SENT') return styles.sent;
    if (type === 'RECEIVED') return styles.received;
    return styles.system;
  };

  // Reverse the order of messages to show newest first
  const displayMessages = messages.slice(-maxMessages).reverse();

  return (
    <section className={styles.messageLogger}>
      <div className={styles.loggerHeader}>
        <h2>PostMessage Log</h2>
        <div className={styles.loggerControls}>
          <span className={styles.messageCount}>
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => {
              // Dispatch action to clear messages
              // Assuming you have a clearMessages action in your Redux slice
              dispatch(clearMessages());
            }}
            className={styles.clearButton}
            disabled={messages.length === 0}
          >
            Clear Log
          </button>
        </div>
      </div>

      <div className={styles.logContainer} ref={logRef}>
        {displayMessages.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              No messages yet. Interact with the embedded card or use the
              controls above.
            </p>
          </div>
        ) : (
          displayMessages.map((message, index) => (
            <div
              key={index}
              className={`${styles.logEntry} ${getMessageTypeClass(message.type)}`}
            >
              <div className={styles.logHeader}>
                <span className={styles.messageType}>{message.type}</span>
                <span className={styles.timestamp}>
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>

              {message.data !== undefined && message.data !== null && (
                <div className={styles.logData}>
                  <pre>{formatMessageData(message.data)}</pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className={styles.loggerFooter}>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.indicator} ${styles.sent}`} />
            <span>Sent to card</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.indicator} ${styles.received}`} />
            <span>Received from card</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.indicator} ${styles.system}`} />
            <span>System message</span>
          </div>
        </div>
      </div>
    </section>
  );
};
