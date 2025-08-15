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

## Updated Hook: `usePageFilters`

The `usePageFilters` hook centralizes the logic for managing page filters and communicating with embedded cards. It provides:

1. **Filter Change Notifications**: Notifies the app and embedded cards of filter changes.
2. **Message Logging**: Logs messages sent and received via postMessage.
3. **Channel Registration**: Manages communication channels with embedded cards.

### Example Usage

```typescript
const [notifyFilterChanges] = usePageFilters(
  (source, filters) => {
    console.log('Filters updated from:', source, filters);
  },
  (message) => {
    console.log('Message logged:', message);
  },
);

// Notify filter changes
notifyFilterChanges([
  { column: 'Region', operator: 'EQUALS', values: ['North America'] },
]);
```

### Key Features

- **Real-time Synchronization**: Ensures filters are synchronized across the app and embedded cards.
- **Message Handling**: Processes inbound and outbound messages for filter updates, drill events, and frame size changes.
- **Echo Prevention**: Avoids redundant updates by comparing current and incoming filter states.

### Message Types

- **`/v1/filters/apply`**: Sends updated filters to embedded cards.
- **`/v1/onAppReady`**: Registers a new communication channel when an App Studio embed is ready.
- **`/v1/onFiltersChange`**: Handles filter changes triggered by user interactions.
- **`/v1/onFrameSizeChange`**: Logs frame size changes.
- **`/v1/onDrill`**: Processes drill events and updates filters accordingly.

### Advanced Features

- **Channel Management**: Dynamically registers and manages communication channels for embedded cards.
- **Filter Validation**: Validates and sanitizes incoming filter data to ensure consistency.
- **Custom Operators**: Supports custom filter operators for advanced use cases.

## Best Practices

### Performance

- **Debounce Updates**: Use debouncing to minimize redundant updates during rapid filter changes.
- **Batch Operations**: Apply multiple filters in a single operation to reduce overhead.

### Security

- **Origin Validation**: Verify the origin of incoming messages to prevent unauthorized access.
- **Data Sanitization**: Clean and validate filter data before applying it.
