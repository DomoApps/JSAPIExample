# Integration Examples

This document provides specific examples of how to integrate the Domo Embed Frames functionality into different types of applications.

## React Integration

### Basic Setup

```jsx
import React, { useEffect, useState } from 'react';
import { EmbeddedCard } from './components/embedded-card';

function Dashboard() {
  const [cardData, setCardData] = useState({
    cardId: 'your-card-id',
    title: 'Sales Dashboard',
  });

  return (
    <div className="dashboard">
      <EmbeddedCard
        cardId={cardData.cardId}
        title={cardData.title}
        width="100%"
        height="500px"
      />
    </div>
  );
}
```

### Advanced Communication Pattern

```jsx
import React, { useEffect, useRef } from 'react';

function AdvancedDashboard() {
  const [filters, setFilters] = useState({});
  const cardRef = useRef();

  // Send filter updates to embedded card
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.sendMessage('FILTER_CHANGE', { filters });
    }
  }, [filters]);

  // Handle messages from card
  const handleCardMessage = (message) => {
    switch (message.type) {
      case 'USER_INTERACTION':
        console.log('User interacted with card:', message.data);
        break;
      case 'DATA_POINT_CLICKED':
        // Navigate to detail view
        navigateToDetail(message.data.dataPoint);
        break;
    }
  };

  return (
    <EmbeddedCard
      ref={cardRef}
      cardId="sales-overview"
      onMessage={handleCardMessage}
    />
  );
}
```

## Vue.js Integration

### Component Setup

```vue
<template>
  <div class="embedded-dashboard">
    <iframe
      ref="cardFrame"
      :src="embedUrl"
      width="100%"
      height="400px"
      frameborder="0"
      @load="onCardLoad"
    />
  </div>
</template>

<script>
export default {
  name: 'DomoCard',
  props: {
    cardId: String,
    domoInstance: String,
  },
  computed: {
    embedUrl() {
      return `https://${this.domoInstance}.domo.com/embed/cards/${this.cardId}`;
    },
  },
  mounted() {
    window.addEventListener('message', this.handleMessage);
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleMessage);
  },
  methods: {
    onCardLoad() {
      this.sendToCard('CARD_INIT', { cardId: this.cardId });
    },
    handleMessage(event) {
      if (event.origin !== `https://${this.domoInstance}.domo.com`) return;
      this.$emit('card-message', event.data);
    },
    sendToCard(type, data) {
      this.$refs.cardFrame.contentWindow.postMessage({ type, data }, '*');
    },
  },
};
</script>
```

## Angular Integration

### Service for Card Communication

```typescript
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DomoCardService {
  private messageSubject = new Subject<any>();
  public messages$ = this.messageSubject.asObservable();

  constructor() {
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  private handleMessage(event: MessageEvent) {
    // Validate origin
    if (!event.origin.includes('.domo.com')) return;
    this.messageSubject.next(event.data);
  }

  sendToCard(cardId: string, type: string, data?: any) {
    const iframe = document.querySelector(
      `iframe[data-card-id="${cardId}"]`,
    ) as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type, data }, '*');
    }
  }
}
```

### Component Implementation

```typescript
import { Component, Input, OnDestroy } from '@angular/core';
import { DomoCardService } from './domo-card.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-domo-card',
  template: `
    <div class="card-container">
      <iframe
        [src]="embedUrl"
        [attr.data-card-id]="cardId"
        width="100%"
        height="400px"
        frameborder="0"
        (load)="onLoad()"
      >
      </iframe>
    </div>
  `,
})
export class DomoCardComponent implements OnDestroy {
  @Input() cardId!: string;
  @Input() domoInstance!: string;

  private subscription: Subscription;

  constructor(private cardService: DomoCardService) {
    this.subscription = this.cardService.messages$.subscribe((message) =>
      this.handleCardMessage(message),
    );
  }

  get embedUrl(): string {
    return `https://${this.domoInstance}.domo.com/embed/cards/${this.cardId}`;
  }

  onLoad() {
    this.cardService.sendToCard(this.cardId, 'CARD_INIT', {
      cardId: this.cardId,
    });
  }

  handleCardMessage(message: any) {
    console.log('Received message from card:', message);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```

## Vanilla JavaScript Integration

### Simple Implementation

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Domo Card Embed</title>
  </head>
  <body>
    <div id="card-container">
      <iframe
        id="domo-card"
        src="https://your-instance.domo.com/embed/cards/your-card-id"
        width="100%"
        height="400px"
        frameborder="0"
      >
      </iframe>
    </div>

    <div id="controls">
      <button onclick="applyFilter()">Apply Filter</button>
      <button onclick="refreshCard()">Refresh</button>
    </div>

    <script>
      // Listen for messages from the embedded card
      window.addEventListener('message', function (event) {
        if (!event.origin.includes('.domo.com')) return;

        console.log('Message from card:', event.data);
        handleCardMessage(event.data);
      });

      function sendToCard(type, data) {
        const iframe = document.getElementById('domo-card');
        iframe.contentWindow.postMessage({ type, data }, '*');
      }

      function applyFilter() {
        sendToCard('FILTER_CHANGE', {
          filters: { region: 'North America' },
        });
      }

      function refreshCard() {
        sendToCard('REFRESH_DATA');
      }

      function handleCardMessage(message) {
        switch (message.type) {
          case 'CARD_LOADED':
            console.log('Card finished loading');
            break;
          case 'USER_INTERACTION':
            console.log('User clicked:', message.data);
            break;
        }
      }
    </script>
  </body>
</html>
```

## WordPress Plugin Integration

### PHP Backend

```php
<?php
/**
 * Plugin Name: Domo Cards Embed
 * Description: Embed Domo cards with postMessage communication
 */

class DomoCardsEmbed {
    public function __construct() {
        add_shortcode('domo_card', array($this, 'render_card_shortcode'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
    }

    public function enqueue_scripts() {
        wp_enqueue_script(
            'domo-cards-js',
            plugin_dir_url(__FILE__) . 'assets/domo-cards.js',
            array('jquery'),
            '1.0.0',
            true
        );
    }

    public function render_card_shortcode($atts) {
        $atts = shortcode_atts(array(
            'card_id' => '',
            'instance' => '',
            'width' => '100%',
            'height' => '400px',
            'title' => 'Domo Card'
        ), $atts);

        if (empty($atts['card_id']) || empty($atts['instance'])) {
            return '<p>Error: Card ID and instance are required.</p>';
        }

        $embed_url = esc_url("https://{$atts['instance']}.domo.com/embed/cards/{$atts['card_id']}");

        return sprintf(
            '<div class="domo-card-container">
                <h3>%s</h3>
                <iframe
                    src="%s"
                    width="%s"
                    height="%s"
                    frameborder="0"
                    data-card-id="%s"
                    class="domo-embedded-card">
                </iframe>
            </div>',
            esc_html($atts['title']),
            $embed_url,
            esc_attr($atts['width']),
            esc_attr($atts['height']),
            esc_attr($atts['card_id'])
        );
    }
}

new DomoCardsEmbed();
?>
```

### JavaScript for WordPress

```javascript
jQuery(document).ready(function ($) {
  // Listen for messages from embedded Domo cards
  window.addEventListener('message', function (event) {
    if (!event.origin.includes('.domo.com')) return;

    handleDomoMessage(event.data);
  });

  function handleDomoMessage(message) {
    console.log('Domo card message:', message);

    // Trigger WordPress events
    $(document).trigger('domo_card_message', [message]);
  }

  // Send messages to all embedded cards
  function sendToAllCards(type, data) {
    $('.domo-embedded-card').each(function () {
      this.contentWindow.postMessage({ type, data }, '*');
    });
  }

  // Expose global functions
  window.DomoCards = {
    sendToAllCards: sendToAllCards,
    sendToCard: function (cardId, type, data) {
      const iframe = $(`[data-card-id="${cardId}"]`)[0];
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type, data }, '*');
      }
    },
  };
});
```

## Security Best Practices

### Content Security Policy

```html
<meta
  http-equiv="Content-Security-Policy"
  content="frame-src 'self' https://*.domo.com; 
               script-src 'self' 'unsafe-inline';"
/>
```

### Origin Validation

```javascript
const ALLOWED_ORIGINS = [
  'https://your-instance.domo.com',
  'https://your-dev-instance.domo.com',
];

function isValidOrigin(origin) {
  return ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
}

window.addEventListener('message', function (event) {
  if (!isValidOrigin(event.origin)) {
    console.warn('Message from unauthorized origin:', event.origin);
    return;
  }

  handleMessage(event.data);
});
```

### Message Validation

```javascript
function validateMessage(message) {
  if (!message || typeof message !== 'object') return false;
  if (!message.type || typeof message.type !== 'string') return false;

  // Validate against known message types
  const allowedTypes = [
    'CARD_LOADED',
    'USER_INTERACTION',
    'DATA_UPDATED',
    'FILTER_APPLIED',
    'ERROR',
  ];

  return allowedTypes.includes(message.type);
}
```
