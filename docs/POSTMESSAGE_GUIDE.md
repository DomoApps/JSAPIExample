# PostMessage Communication Guide

This guide covers the postMessage communication patterns used in the Domo Embed Frames example, including message types, data structures, and best practices.

## Message Structure

All messages follow a consistent structure:

```typescript
interface DomoMessage {
  type: string; // Message type identifier
  data?: any; // Optional payload data
  timestamp?: number; // Optional timestamp
  cardId?: string; // Optional card identifier
  source?: string; // Optional source identifier
}
```

## Message Types

### Outbound Messages (Host → Card)

#### CARD_INIT

Sent when a card is first loaded to initialize communication.

```javascript
{
  type: 'CARD_INIT',
  data: {
    cardId: 'card-123',
    title: 'Sales Dashboard',
    config: {
      theme: 'light',
      locale: 'en-US'
    }
  }
}
```

#### FILTER_CHANGE

Apply filters to the embedded card data.

```javascript
{
  type: 'FILTER_CHANGE',
  data: {
    filters: [
      {
        column: 'Region',
        operator: 'EQUALS',
        values: ['North America']
      },
      {
        column: 'Date',
        operator: 'BETWEEN',
        values: ['2024-01-01', '2024-12-31']
      }
    ]
  }
}
```

#### SYNC_PAGE_FILTERS

Synchronizes current page filter state with embedded cards.

```javascript
{
  type: 'SYNC_PAGE_FILTERS',
  data: {
    filters: [...currentPageFilters]
  }
}
```

#### REFRESH_DATA

Trigger a data refresh in the embedded card.

```javascript
{
  type: 'REFRESH_DATA',
  data: {
    force: true,  // Force refresh even if data is cached
    source: 'user_action'
  }
}
```

#### CUSTOM_EVENT

Send custom application-specific events.

```javascript
{
  type: 'CUSTOM_EVENT',
  data: {
    action: 'highlight_data',
    target: 'top_performers',
    parameters: {
      threshold: 1000,
      metric: 'revenue'
    }
  }
}
```

### Inbound Messages (Card → Host)

#### CARD_LOADED

Sent when the card has finished loading and is ready for interaction.

```javascript
{
  type: 'CARD_LOADED',
  data: {
    cardId: 'card-123',
    version: '2.1.0',
    capabilities: ['filtering', 'export', 'drill_down']
  }
}
```

#### FILTER_STATE_RESPONSE

Response to filter state requests.

```javascript
{
  type: 'FILTER_STATE_RESPONSE',
  data: {
    requestId: 1642694400000,
    appliedFilters: [...],
    availableColumns: ['Region', 'Date', 'Revenue']
  }
}
```

#### FILTER_INTERACTION

Sent when user interacts with filters within the card.

```javascript
{
  type: 'FILTER_INTERACTION',
  data: {
    action: 'filter_applied',
    filter: {
      column: 'Category',
      operator: 'EQUALS',
      values: ['Electronics']
    }
  }
}
```

#### DRILL_DOWN

Sent when user performs a drill-down action.

```javascript
{
  type: 'DRILL_DOWN',
  data: {
    level: 'product',
    parentCategory: 'Electronics',
    filters: {
      category: 'Electronics',
      subcategory: 'Smartphones'
    }
  }
}
```

#### ERROR

Sent when an error occurs in the embedded card.

```javascript
{
  type: 'ERROR',
  data: {
    code: 'DATA_LOAD_FAILED',
    message: 'Failed to load chart data',
    details: {
      url: '/api/data/sales',
      status: 500,
      timestamp: 1642694400000
    }
  }
}
```

## Implementation Patterns

### Message Queue Pattern

For handling multiple rapid messages:

```javascript
class MessageQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  enqueue(message) {
    this.queue.push(message);
    this.process();
  }

  async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const message = this.queue.shift();
      await this.handleMessage(message);
    }

    this.processing = false;
  }

  async handleMessage(message) {
    // Process message with delay to prevent overwhelming the card
    return new Promise((resolve) => {
      setTimeout(() => {
        this.sendToCard(message);
        resolve();
      }, 100);
    });
  }
}
```

### Security Considerations

#### Origin Validation

Always validate the origin of incoming messages:

```javascript
const TRUSTED_ORIGINS = [
  'https://your-instance.domo.com',
  'https://dev-instance.domo.com',
];

function isValidOrigin(origin) {
  return TRUSTED_ORIGINS.some((trusted) => origin === trusted);
}

window.addEventListener('message', (event) => {
  if (!isValidOrigin(event.origin)) {
    console.warn('Rejected message from untrusted origin:', event.origin);
    return;
  }

  handleMessage(event.data);
});
```

#### Message Sanitization

Sanitize incoming message data:

```javascript
function sanitizeMessage(message) {
  if (!message || typeof message !== 'object') {
    throw new Error('Invalid message format');
  }

  const sanitized = {
    type: String(message.type || '').slice(0, 50),
    timestamp: Date.now(),
  };

  if (message.data) {
    sanitized.data = sanitizeData(message.data);
  }

  return sanitized;
}

function sanitizeData(data) {
  if (Array.isArray(data)) {
    return data.slice(0, 100).map(sanitizeData);
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    Object.keys(data)
      .slice(0, 20)
      .forEach((key) => {
        const cleanKey = String(key).slice(0, 50);
        sanitized[cleanKey] = sanitizeData(data[key]);
      });
    return sanitized;
  }

  if (typeof data === 'string') {
    return data.slice(0, 1000);
  }

  return data;
}
```
