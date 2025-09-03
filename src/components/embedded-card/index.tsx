import React, { useRef, useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const embedId =
    iframeUrl.split('/').pop() === undefined ? '' : iframeUrl.split('/').pop();

  useEffect(() => {
    const loadEmbedCard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch the embed token and URL from our server
        const response = await fetch(iframeUrl, {
          credentials: 'include', // Include session cookies
        });

        if (!response.ok) {
          const responseText = await response.text();
          throw new Error(
            `Failed to load embed data: ${response.status} - ${responseText.substring(0, 200)}`,
          );
        }

        const responseText = await response.text();
        let embedData;
        try {
          embedData = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error(
            `Server returned invalid JSON. Response: ${responseText.substring(0, 200)}`,
          );
        }
        const { embedToken, embedUrl } = embedData;

        // Create the HTML content with the form that submits to Domo
        const formHtml = `
          <html>
            <body style="margin: 0; padding: 0;">
              <form id="embedForm" action="${embedUrl}?referenceId=${embedId}" method="post">
                <input type="hidden" name="embedToken" value="${embedToken}">
              </form>
              <script>
                document.getElementById("embedForm").submit();
              </script>
            </body>
          </html>
        `;

        // Set the iframe content using srcdoc
        if (iframeRef.current) {
          iframeRef.current.srcdoc = formHtml;
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading embed card:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    };

    loadEmbedCard();
  }, [iframeUrl, embedId]);

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
        {isLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            Loading embed card...
          </div>
        )}
        {error !== null && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              color: 'red',
            }}
          >
            Error: {error}
          </div>
        )}
        <iframe
          ref={iframeRef}
          title={title}
          width={width}
          height={height}
          allowFullScreen
          data-domo-card={embedId}
          className={styles.cardFrame}
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
          style={{ display: isLoading || error !== null ? 'none' : 'block' }}
        />
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.status}>
          {isLoading
            ? 'Loading...'
            : error !== null
              ? 'Error occurred'
              : 'Ready for postMessage communication'}
        </span>
      </div>
    </div>
  );
};
