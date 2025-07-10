// example-server.js
// Example Express server using the headless browser teleporter

const express = require('express');
const { headlessBrowser } = require('./headless-browser-teleporter');

const app = express();
const port = 3000;

// Basic usage example
async function basicTeleportExample() {
  try {
    console.log('🚀 Starting basic teleport example...');
    
    const result = await headlessBrowser.teleport('https://example.com/events', {
      readyTimeout: 10000,
      autoDetectDelay: 2000
    });
    
    if (result.valid) {
      console.log('✅ Teleportation successful!');
      console.log('Type:', result.type);
      console.log('Content length:', result.content?.length || 0);
      console.log('Attributes:', result.attributes);
    } else {
      console.log('❌ Teleportation failed');
    }
  } catch (error) {
    console.error('Teleportation error:', error.message);
  }
}

// Advanced usage with persistent teleporter
async function advancedTeleportExample() {
  const teleporter = headlessBrowser.createTeleporter({
    maxBrowsers: 3,
    renderTimeout: 15000,
    cacheTimeout: 10 * 60 * 1000 // 10 minutes
  });
  
  try {
    await teleporter.initialize();
    console.log('🚀 Teleporter initialized');
    
    // Health check
    const health = await teleporter.healthCheck();
    console.log('Health check:', health);
    
    // Multiple teleports with caching
    const urls = [
      'http://example1.com/feed',
      'https://example2.com/events',
      'https://example1.com/feed' // This should hit cache
    ];
    
    for (const url of urls) {
      const startTime = Date.now();
      const result = await teleporter.teleportFromURL(url);
      const duration = Date.now() - startTime;
      
      console.log(`Teleported ${url} in ${duration}ms`);
      console.log(`Result: ${result.valid ? 'SUCCESS' : 'FAILED'}`);
      if (result.content) {
        console.log(`Content length: ${result.content.length}`);
      }
    }
    
  } finally {
    await teleporter.shutdown();
    console.log('🔒 Teleporter shut down');
  }
}

// Express middleware example
async function setupExpressServer() {
  const teleportMiddleware = await headlessBrowser.createMiddleware({
    maxBrowsers: 5,
    renderTimeout: 20000
  });
  
  // Health check endpoint
  app.get('/health', async (req, res) => {
    const health = await teleportMiddleware.teleporter.healthCheck();
    res.json({
      service: 'headless-teleporter',
      ...health,
      timestamp: new Date().toISOString()
    });
  });
  
  // Main teleportation endpoint
  app.get('/user/:uuid/teleport', teleportMiddleware.middleware);
  
  // Cache management
  app.delete('/cache', async (req, res) => {
    await teleportMiddleware.teleporter.clearCache();
    res.json({ message: 'Cache cleared' });
  });
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('Shutting down teleporter...');
    await teleportMiddleware.shutdown();
    process.exit(0);
  });
  
  process.on('SIGINT', async () => {
    console.log('Shutting down teleporter...');
    await teleportMiddleware.shutdown();
    process.exit(0);
  });
  
  app.listen(port, () => {
    console.log(`🚀 Teleporter server running at http://localhost:${port}`);
  });
}

// Batch teleportation example
async function batchTeleportExample() {
  const teleporter = headlessBrowser.createTeleporter();
  
  try {
    await teleporter.initialize();
    
    const feedUrls = [
      'https://portland-events.com/feed',
      'https://seattle-events.com/feed',
      'https://sf-events.com/feed'
    ];
    
    // Process multiple feeds concurrently (but limit concurrency)
    const concurrencyLimit = 3;
    const results = [];
    
    for (let i = 0; i < feedUrls.length; i += concurrencyLimit) {
      const batch = feedUrls.slice(i, i + concurrencyLimit);
      const batchPromises = batch.map(async (url) => {
        try {
          const result = await teleporter.teleportFromURL(url);
          return { url, success: true, result };
        } catch (error) {
          return { url, success: false, error: error.message };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      console.log(`Completed batch ${Math.floor(i / concurrencyLimit) + 1}`);
    }
    
    // Summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`\nBatch teleportation complete:`);
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    
    return results;
    
  } finally {
    await teleporter.shutdown();
  }
}

// Custom teleportation with specific options
async function customTeleportExample() {
  const teleporter = headlessBrowser.createTeleporter({
    renderTimeout: 30000, // 30 seconds for slow sites
    cacheTimeout: 60 * 60 * 1000 // 1 hour cache
  });
  
  try {
    await teleporter.initialize();
    
    const result = await teleporter.teleportFromURL('https://slow-site.com/events', {
      viewport: {
        width: 1920,
        height: 1080
      },
      readyTimeout: 25000,
      autoDetectDelay: 5000
    });
    
    if (result.valid) {
      console.log('Custom teleportation successful!');
      
      // Save to file or database
      const fs = require('fs').promises;
      await fs.writeFile(
        `teleport-${Date.now()}.html`, 
        result.content,
        'utf8'
      );
      
      console.log('Teleported content saved to file');
    }
    
  } finally {
    await teleporter.shutdown();
  }
}

// Main execution
async function main() {
  console.log('🌟 Headless Browser Teleporter Examples\n');
  
  // Choose which example to run
  const example = process.argv[2] || 'basic';
  
  switch (example) {
    case 'basic':
      await basicTeleportExample();
      break;
      
    case 'advanced':
      await advancedTeleportExample();
      break;
      
    case 'server':
      await setupExpressServer();
      break;
      
    case 'batch':
      await batchTeleportExample();
      break;
      
    case 'custom':
      await customTeleportExample();
      break;
      
    default:
      console.log('Available examples: basic, advanced, server, batch, custom');
      console.log('Usage: node example-server.js [example]');
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  basicTeleportExample,
  advancedTeleportExample,
  setupExpressServer,
  batchTeleportExample,
  customTeleportExample
};
