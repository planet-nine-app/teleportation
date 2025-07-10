# Headless Browser Teleporter

A Node.js module for extracting content from `<teleport>` tags using headless browsers. This enables secure content syndication where content creators maintain full control over their rendered output.

## Features

- 🎯 **Explicit Content Control**: Only extracts content from `<teleport>` tags
- 🔒 **Trust Preserved**: Content creators' JavaScript runs in headless browser
- ⚡ **Smart Caching**: Built-in caching with configurable timeouts
- 🏊 **Browser Pooling**: Efficient browser instance management
- 🚀 **Express Integration**: Ready-to-use middleware
- 📊 **Health Monitoring**: Built-in health checks and monitoring

## Installation

```bash
npm install headless-browser-teleporter
```

## Quick Start

### Basic Usage

```javascript
const { headlessBrowser } = require('headless-browser-teleporter');

// Simple one-off teleportation
const result = await headlessBrowser.teleport('https://example.com/events');

if (result.valid) {
  console.log('Content:', result.content);
  console.log('Attributes:', result.attributes);
}
```

### Express Server

```javascript
const express = require('express');
const { headlessBrowser } = require('headless-browser-teleporter');

const app = express();

// Create teleportation middleware
const teleportMiddleware = await headlessBrowser.createMiddleware({
  maxBrowsers: 5,
  renderTimeout: 20000
});

// Use the middleware
app.get('/user/:uuid/teleport', teleportMiddleware.middleware);

app.listen(3000);
```

### Persistent Teleporter

```javascript
const { headlessBrowser } = require('headless-browser-teleporter');

// Create a persistent teleporter instance
const teleporter = headlessBrowser.createTeleporter({
  maxBrowsers: 3,
  renderTimeout: 15000,
  cacheTimeout: 10 * 60 * 1000 // 10 minutes
});

await teleporter.initialize();

try {
  // Multiple teleports with caching
  const result1 = await teleporter.teleportFromURL('https://site1.com/feed');
  const result2 = await teleporter.teleportFromURL('https://site2.com/events');
  
  console.log('Teleported from multiple sites!');
} finally {
  await teleporter.shutdown();
}
```

## API Reference

### `headlessBrowser` Object

#### Methods

- **`teleport(url, options)`** - One-off teleportation
- **`createTeleporter(options)`** - Create persistent teleporter instance
- **`createMiddleware(options)`** - Create Express middleware
- **`isValidURL(url)`** - Validate teleportation URL

### `HeadlessBrowserTeleporter` Class

#### Constructor Options

```javascript
{
  maxBrowsers: 5,           // Maximum browser instances
  renderTimeout: 10000,     // Page render timeout (ms)
  cacheTimeout: 300000      // Cache timeout (ms)
}
```

#### Methods

- **`initialize()`** - Initialize browser pool
- **`teleportFromURL(url, options)`** - Extract content from URL
- **`healthCheck()`** - Check teleporter health
- **`clearCache()`** - Clear cached results
- **`shutdown()`** - Clean shutdown

#### Teleport Options

```javascript
{
  viewport: {
    width: 1200,
    height: 800
  },
  readyTimeout: 15000,      // Wait for ready signal (ms)
  autoDetectDelay: 2000     // Auto-detect delay (ms)
}
```

## Content Creator Integration

Content creators need to wrap their content in `<teleport>` tags:

```html
<teleport data-feed="events" data-type="posts" data-version="1.0">
  <div class="events-feed">
    <div class="event-card">Event 1</div>
    <div class="event-card">Event 2</div>
  </div>
</teleport>
```

### Ready Signaling (Optional)

For dynamic content, signal when ready:

```javascript
// Wait for content to load, then signal
if (window.__TELEPORTATION__) {
  window.__TELEPORTATION__.signalReady({
    type: 'my-feed',
    content: document.querySelector('teleport').innerHTML,
    metadata: { totalItems: 5 }
  });
}
```

## Response Format

```javascript
{
  valid: true,
  type: 'teleport-tag',
  content: '<div class="events-feed">...</div>',
  attributes: {
    'data-feed': 'events',
    'data-type': 'posts',
    'data-version': '1.0'
  },
  metadata: {
    title: 'Events Page',
    url: 'https://example.com/events',
    viewport: { width: 1200, height: 800 },
    timestamp: 1640995200000
  },
  extractedAt: '2023-12-31T12:00:00.000Z'
}
```

## Examples

### Health Check

```javascript
const health = await teleporter.healthCheck();
console.log(health); // { healthy: true, browsers: 3 }
```

### Batch Processing

```javascript
const urls = [
  'https://site1.com/feed',
  'https://site2.com/feed',
  'https://site3.com/feed'
];

const results = await Promise.all(
  urls.map(url => teleporter.teleportFromURL(url))
);
```

### Cache Management

```javascript
// Clear cache
await teleporter.clearCache();

// Check cache status
const cacheSize = teleporter.cache.size;
```

## Express Middleware Example

```javascript
const teleportMiddleware = await headlessBrowser.createMiddleware();

// Main endpoint
app.get('/teleport/:uuid', teleportMiddleware.middleware);

// Health check
app.get('/health', async (req, res) => {
  const health = await teleportMiddleware.teleporter.healthCheck();
  res.json(health);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await teleportMiddleware.shutdown();
  process.exit(0);
});
```

## Error Handling

```javascript
try {
  const result = await teleporter.teleportFromURL(url);
  
  if (!result.valid) {
    console.log('Teleportation failed:', result.error);
  }
} catch (error) {
  console.error('Teleporter error:', error.message);
}
```

## Requirements

- Node.js 16+
- Chrome/Chromium (automatically installed with Puppeteer)

## License

MIT
