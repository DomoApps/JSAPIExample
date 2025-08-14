import React, { useRef } from 'react';
import styles from './index.module.scss';

export interface EmbeddedCardProps {
  iframeUrl: string;
  title: string;
  width?: number; // Enforce pixel-based sizes
  height?: number; // Enforce pixel-based sizes
}

export const EmbeddedCard: React.FC<EmbeddedCardProps> = ({
  iframeUrl,
  title,
  width = 800, // Default to 800px
  height = 400, // Default to 400px
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const embedId =
    iframeUrl.split('/').pop() === undefined ? '' : iframeUrl.split('/').pop();

  return (
    <div className={styles.embeddedCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <span className={styles.cardId}>Card ID: {embedId}</span>
      </div>

      <div
        className={styles.cardContainer}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          title={title}
          width={width}
          height={height}
          frameBorder="0"
          allowFullScreen
          data-domo-card={embedId}
          className={styles.cardFrame}
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
        />
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.status}>
          Ready for postMessage communication
        </span>
      </div>
    </div>
  );
};
