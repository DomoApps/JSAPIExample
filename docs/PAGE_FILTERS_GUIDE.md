# Page Filters Integration Guide

This guide explains how to integrate Domo page filters with embedded cards using postMessage communication in the Advanced App Platform.

## Overview

Page filters in Domo allow users to apply global filters that affect multiple cards and visualizations across a page. This example demonstrates how to:

1. Listen for page filter changes using the Domo API
2. Communicate filter updates to embedded cards via postMessage
3. Synchronize filter states between the host application and embedded content
4. Handle filter-related user interactions

## Architecture

```plaintext
Domo Platform
    ↓ (filter updates)
PageFiltersManager Component
    ↓ (filter state)
App Component
    ↓ (postMessage)
Embedded Card iframes
```

## Key Components

### PageFiltersManager

The `PageFiltersManager` component serves as the bridge between Domo's page filter system and your embedded cards:

```typescript
interface PageFilter {
  column: string;
  operator: string;
  values: string[];
}
```

#### Features

- **Real-time filter listening**: Responds to page filter changes from Domo
- **Filter management**: Add, remove, and clear filters programmatically
- **Quick filter presets**: Pre-configured filters for common use cases
- **Custom filter creation**: UI for creating custom filters on the fly

### Integration with Domo API

The component integrates with Domo's JavaScript API:

```javascript
// Listen for filter updates
window.domo.onFiltersUpdate((updatedFilters) => {
  // Handle filter changes
  onFiltersChange(updatedFilters);
});

// Get current filters
const currentFilters = await window.domo.getFilters();

// Apply new filters
await window.domo.setFilters(newFilters);
```

## Message Types for Page Filters

### Outbound Messages (Host → Card)

#### PAGE_FILTERS_UPDATED

Sent when page filters change in the Domo environment.

```javascript
{
  type: 'PAGE_FILTERS_UPDATED',
  data: {
    filters: [
      {
        column: 'Region',
        operator: 'EQUALS',
        values: ['North America']
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

#### REQUEST_FILTER_STATE

Requests the current filter state from an embedded card.

```javascript
{
  type: 'REQUEST_FILTER_STATE',
  data: {
    requestId: 1642694400000
  }
}
```

### Inbound Messages (Card → Host)

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

## Development vs Production

### Development Mode

When running in development (without Domo platform):

- Page filters functionality is simulated
- Mock data and interactions are provided
- Status indicator shows "Development Mode"

### Production Mode

When deployed to Domo platform:

- Full integration with Domo's page filter system
- Real-time synchronization with platform filters
- Status indicator shows "Domo Connected"

## Usage Examples

### Basic Filter Application

```typescript
// Apply a simple filter
const regionFilter: PageFilter = {
  column: 'Region',
  operator: 'EQUALS',
  values: ['North America'],
};

await window.domo.setFilters([regionFilter]);
```

### Multiple Filter Management

```typescript
// Apply multiple filters
const filters: PageFilter[] = [
  {
    column: 'Region',
    operator: 'EQUALS',
    values: ['North America', 'Europe'],
  },
  {
    column: 'Revenue',
    operator: 'GREATER_THAN',
    values: ['100000'],
  },
];

await window.domo.setFilters(filters);
```

### Filter Change Handling

```typescript
// Listen for and handle filter changes
window.domo.onFiltersUpdate((filters) => {
  // Update embedded cards
  const message = {
    type: 'PAGE_FILTERS_UPDATED',
    data: { filters },
  };

  document.querySelectorAll('iframe[data-domo-card]').forEach((iframe) => {
    iframe.contentWindow.postMessage(message, '*');
  });
});
```

## Testing Page Filters

### Mock Data for Development

```typescript
const mockFilters: PageFilter[] = [
  {
    column: 'Date',
    operator: 'GREATER_THAN_EQUAL',
    values: ['2024-01-01'],
  },
  {
    column: 'Region',
    operator: 'EQUALS',
    values: ['North America'],
  },
];

// Simulate filter update
setTimeout(() => {
  handlePageFiltersChange(mockFilters);
}, 2000);
```

### Integration Testing

```typescript
// Test filter synchronization
describe('Page Filters Integration', () => {
  test('should sync filters to embedded cards', () => {
    const filters = [{ column: 'Region', operator: 'EQUALS', values: ['US'] }];

    component.handlePageFiltersChange(filters);

    expect(mockIframe.contentWindow.postMessage).toHaveBeenCalledWith(
      {
        type: 'PAGE_FILTERS_UPDATED',
        data: { filters },
      },
      '*',
    );
  });
});
```

## Best Practices

### Performance

- **Debounce filter updates**: Prevent excessive messaging during rapid filter changes
- **Batch filter operations**: Apply multiple filters in a single operation
- **Cache filter states**: Store current filter state to avoid unnecessary updates

### Error Handling

- **Graceful degradation**: Provide fallback behavior when Domo API is unavailable
- **Validation**: Validate filter data before applying
- **User feedback**: Show status and error messages to users

### Security

- **Origin validation**: Verify message origins from embedded cards
- **Data sanitization**: Clean and validate filter values
- **Permission checking**: Ensure user has permission to modify filters

## Troubleshooting

### Common Issues

1. **Filters not applying**: Check Domo API availability and permissions
2. **Messages not received**: Verify iframe origins and postMessage syntax
3. **Performance issues**: Implement debouncing and batch operations
4. **State synchronization**: Ensure proper cleanup of event listeners

### Debugging Tools

```typescript
// Enable debug logging
window.domoDebug = true;

// Log all filter operations
window.domo.onFiltersUpdate((filters) => {
  console.log('Page filters updated:', filters);
  // Your filter handling code
});
```

## Advanced Features

### Custom Filter Operators

```typescript
const customOperators = {
  CUSTOM_RANGE: (values) => ({
    min: values[0],
    max: values[1],
  }),
  CONTAINS_ANY: (values) => ({
    searchTerms: values,
  }),
};
```

### Filter Persistence

```typescript
// Save filters to local storage
const saveFilters = (filters: PageFilter[]) => {
  localStorage.setItem('savedFilters', JSON.stringify(filters));
};

// Restore filters on load
const restoreFilters = (): PageFilter[] => {
  const saved = localStorage.getItem('savedFilters');
  return saved ? JSON.parse(saved) : [];
};
```

### Filter Analytics

```typescript
// Track filter usage
const trackFilterUsage = (filter: PageFilter) => {
  // Send analytics event
  analytics.track('filter_applied', {
    column: filter.column,
    operator: filter.operator,
    valueCount: filter.values.length,
  });
};
```
