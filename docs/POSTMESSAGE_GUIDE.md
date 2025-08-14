# PostMessage Communication Guide

This guide covers the postMessage communication patterns used in the Domo Embed Frames example, including message types, data structures, and best practices.

## Message Structure

All messages follow a consistent structure:

```typescript
interface DomoMessage {
  type: string;           // Message type identifier
  data?: any;            // Optional payload data
  timestamp?: number;    // Optional timestamp
  cardId?: string;       // Optional card identifier
  source?: string;       // Optional source identifier
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
    filters: {
      region: 'North America',
      dateRange: {
        start: '2024-01-01',
        end: '2024-12-31'
      },
      category: ['Electronics', 'Clothing']
    }
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

#### EXPORT_DATA
Request data export from the card.

```javascript
{
  type: 'EXPORT_DATA',
  data: {
    format: 'csv',      // csv, xlsx, json, pdf
    includeFilters: true,
    filename: 'sales_report_2024'
  }
}
```

#### THEME_CHANGE
Update the visual theme of the embedded card.

```javascript
{
  type: 'THEME_CHANGE',
  data: {
    theme: 'dark',
    colors: {
      primary: '#007bff',
      secondary: '#6c757d'
    }
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

#### USER_INTERACTION
Sent when the user interacts with elements in the card.

```javascript
{
  type: 'USER_INTERACTION',
  data: {
    action: 'click',
    element: 'data_point',
    coordinates: { x: 150, y: 200 },
    value: {
      category: 'Electronics',
      revenue: 50000,
      region: 'North America'
    }
  }
}
```

#### DATA_UPDATED
Sent when the card's data has been updated.

```javascript
{
  type: 'DATA_UPDATED',
  data: {
    timestamp: 1642694400000,
    recordCount: 1250,
    lastRefresh: '2024-01-20T10:30:00Z',
    changes: {
      added: 50,
      modified: 25,
      removed: 5
    }
  }
}
```

#### FILTER_APPLIED
Confirmation that filters have been successfully applied.

```javascript
{
  type: 'FILTER_APPLIED',
  data: {
    appliedFilters: {
      region: 'North America',
      dateRange: {
        start: '2024-01-01',
        end: '2024-12-31'
      }
    },
    resultCount: 850,
    success: true
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
    return new Promise(resolve => {
      setTimeout(() => {
        this.sendToCard(message);
        resolve();
      }, 100);
    });
  }
}
```

### Request-Response Pattern

For messages that expect a response:

```javascript
class MessageBridge {
  constructor() {
    this.pendingRequests = new Map();
    this.requestId = 0;
  }

  async sendRequest(type, data, timeout = 5000) {
    const id = ++this.requestId;
    
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error('Request timeout'));
      }, timeout);

      this.pendingRequests.set(id, { resolve, reject, timer });

      this.sendMessage({
        type,
        data,
        requestId: id
      });
    });
  }

  handleResponse(message) {
    if (message.requestId && this.pendingRequests.has(message.requestId)) {
      const { resolve, timer } = this.pendingRequests.get(message.requestId);
      clearTimeout(timer);
      this.pendingRequests.delete(message.requestId);
      resolve(message);
    }
  }
}
```

### Event Batching Pattern

For batching multiple filter changes:

```javascript
class FilterBatcher {
  constructor(sendCallback, delay = 300) {
    this.sendCallback = sendCallback;
    this.delay = delay;
    this.pendingFilters = {};
    this.timeoutId = null;
  }

  addFilter(key, value) {
    this.pendingFilters[key] = value;
    this.scheduleUpdate();
  }

  removeFilter(key) {
    delete this.pendingFilters[key];
    this.scheduleUpdate();
  }

  scheduleUpdate() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.sendCallback({
        type: 'FILTER_CHANGE',
        data: { filters: { ...this.pendingFilters } }
      });
      this.timeoutId = null;
    }, this.delay);
  }
}
```

## Security Considerations

### Origin Validation

Always validate the origin of incoming messages:

```javascript
const TRUSTED_ORIGINS = [
  'https://your-instance.domo.com',
  'https://dev-instance.domo.com'
];

function isValidOrigin(origin) {
  return TRUSTED_ORIGINS.some(trusted => origin === trusted);
}

window.addEventListener('message', (event) => {
  if (!isValidOrigin(event.origin)) {
    console.warn('Rejected message from untrusted origin:', event.origin);
    return;
  }
  
  handleMessage(event.data);
});
```

### Message Sanitization

Sanitize incoming message data:

```javascript
function sanitizeMessage(message) {
  if (!message || typeof message !== 'object') {
    throw new Error('Invalid message format');
  }

  const sanitized = {
    type: String(message.type || '').slice(0, 50),
    timestamp: Date.now()
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
    Object.keys(data).slice(0, 20).forEach(key => {
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

### Rate Limiting

Implement rate limiting for incoming messages:

```javascript
class RateLimiter {
  constructor(maxMessages = 100, windowMs = 60000) {
    this.maxMessages = maxMessages;
    this.windowMs = windowMs;
    this.messages = [];
  }

  isAllowed() {
    const now = Date.now();
    this.messages = this.messages.filter(time => now - time < this.windowMs);
    
    if (this.messages.length >= this.maxMessages) {
      return false;
    }
    
    this.messages.push(now);
    return true;
  }
}

const rateLimiter = new RateLimiter();

window.addEventListener('message', (event) => {
  if (!rateLimiter.isAllowed()) {
    console.warn('Rate limit exceeded, ignoring message');
    return;
  }
  
  handleMessage(event.data);
});
```

## Testing Strategies

### Message Mocking

Create mock messages for testing:

```javascript
class MessageMocker {
  constructor() {
    this.mockMessages = {
      cardLoaded: {
        type: 'CARD_LOADED',
        data: { cardId: 'test-card', version: '1.0.0' }
      },
      userClick: {
        type: 'USER_INTERACTION',
        data: { action: 'click', value: { revenue: 1000 } }
      },
      error: {
        type: 'ERROR',
        data: { code: 'TEST_ERROR', message: 'Test error message' }
      }
    };
  }

  sendMockMessage(messageType, delay = 0) {
    setTimeout(() => {
      const event = new MessageEvent('message', {
        data: this.mockMessages[messageType],
        origin: 'https://test-instance.domo.com'
      });
      window.dispatchEvent(event);
    }, delay);
  }

  simulateUserFlow() {
    this.sendMockMessage('cardLoaded', 100);
    this.sendMockMessage('userClick', 2000);
  }
}
```

### Integration Testing

Test message flows:

```javascript
describe('Domo Card Communication', () => {
  let mockWindow;
  let messageHandler;

  beforeEach(() => {
    mockWindow = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      postMessage: jest.fn()
    };
    
    messageHandler = new DomoCardMessageHandler(mockWindow);
  });

  test('should handle card loaded message', () => {
    const message = {
      type: 'CARD_LOADED',
      data: { cardId: 'test-card' }
    };

    messageHandler.handleMessage(message);
    
    expect(messageHandler.isCardReady('test-card')).toBe(true);
  });

  test('should send filter change message', () => {
    const filters = { region: 'North America' };
    
    messageHandler.sendFilterChange('test-card', filters);
    
    expect(mockWindow.postMessage).toHaveBeenCalledWith({
      type: 'FILTER_CHANGE',
      data: { filters }
    }, '*');
  });
});
```

## Performance Optimization

### Message Debouncing

Prevent excessive message sending:

```javascript
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedFilterChange = debounce((filters) => {
  sendToCard('FILTER_CHANGE', { filters });
}, 300);
```

### Memory Management

Clean up event listeners and references:

```javascript
class DomoCardManager {
  constructor() {
    this.cards = new Map();
    this.messageListener = this.handleMessage.bind(this);
    window.addEventListener('message', this.messageListener);
  }

  addCard(cardId, iframe) {
    this.cards.set(cardId, {
      iframe,
      lastActivity: Date.now()
    });
  }

  removeCard(cardId) {
    this.cards.delete(cardId);
  }

  cleanup() {
    window.removeEventListener('message', this.messageListener);
    this.cards.clear();
  }

  // Clean up inactive cards
  cleanupInactiveCards(maxAge = 300000) { // 5 minutes
    const now = Date.now();
    for (const [cardId, card] of this.cards) {
      if (now - card.lastActivity > maxAge) {
        this.removeCard(cardId);
      }
    }
  }
}
```
