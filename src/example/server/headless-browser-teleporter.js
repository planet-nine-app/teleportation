// headless-browser-teleporter.js
// Node.js module for headless browser teleportation

const puppeteer = require('puppeteer');
const crypto = require('crypto');

class HeadlessBrowserTeleporter {
  constructor(options = {}) {
    this.browserPool = [];
    this.maxBrowsers = options.maxBrowsers || 5;
    this.renderTimeout = options.renderTimeout || 10000; // 10 seconds
    this.cache = new Map();
    this.cacheTimeout = options.cacheTimeout || 5 * 60 * 1000; // 5 minutes
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    // Pre-warm browser pool
    for (let i = 0; i < Math.min(this.maxBrowsers, 2); i++) {
      const browser = await this.createBrowser();
      this.browserPool.push(browser);
    }
    
    this.initialized = true;
    console.log(`Initialized headless teleporter with ${this.browserPool.length} browsers`);
  }

  async createBrowser() {
    return await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security', // For cross-origin content
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=VizDisplayCompositor'
      ]
    });
  }

  async getBrowser() {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (this.browserPool.length > 0) {
      return this.browserPool.pop();
    }
    
    // Create new browser if pool is empty and we haven't hit max
    if (this.browserPool.length < this.maxBrowsers) {
      return await this.createBrowser();
    }
    
    throw new Error('Browser pool exhausted');
  }

  async returnBrowser(browser) {
    try {
      // Close all pages except one
      const pages = await browser.pages();
      for (let i = 1; i < pages.length; i++) {
        await pages[i].close();
      }
      
      // Clear any stored data
      await pages[0].evaluate(() => {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (e) {
          // Ignore errors
        }
      });
      
      this.browserPool.push(browser);
    } catch (error) {
      console.warn('Error returning browser to pool:', error.message);
      // If browser is corrupted, close it
      try {
        await browser.close();
      } catch (e) {
        // Ignore close errors
      }
    }
  }

  async teleportFromURL(url, options = {}) {
    const cacheKey = this.getCacheKey(url, options);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const browser = await this.getBrowser();
    
    try {
      const result = await this.renderAndExtract(browser, url, options);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    } finally {
      await this.returnBrowser(browser);
    }
  }

  async renderAndExtract(browser, url, options) {
    const page = await browser.newPage();
    
    try {
      // Set viewport for consistent rendering
      await page.setViewport({
        width: options.viewport?.width || 1200,
        height: options.viewport?.height || 800,
        deviceScaleFactor: 1
      });

      // Set up teleportation communication
      await this.setupTeleportationAPI(page, options);

      // Navigate to the page
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: this.renderTimeout
      });

      // Wait for teleportation ready signal
      const teleportData = await this.waitForTeleportationReady(page, options);
      
      return teleportData;
      
    } finally {
      await page.close();
    }
  }

  async setupTeleportationAPI(page, options) {
    // Inject teleportation API into the page
    await page.evaluateOnNewDocument((opts) => {
      window.__TELEPORTATION__ = {
        ready: false,
        data: null,
        config: opts,
        
        // API for content creators to signal ready state
        signalReady: function(teleportData) {
          console.log('🚀 Teleportation ready signal received');
          this.ready = true;
          this.data = teleportData;
          
          // Dispatch custom event
          window.dispatchEvent(new CustomEvent('teleportationReady', {
            detail: teleportData
          }));
        },
        
        // Extract content from <teleport> tag
        extractTeleportTag: function() {
          const teleportTag = document.querySelector('teleport');
          if (!teleportTag) {
            return null;
          }
          
          return {
            html: teleportTag.innerHTML, // Inner HTML only, not the <teleport> wrapper
            outerHTML: teleportTag.outerHTML, // Full tag if needed
            attributes: Object.fromEntries(
              Array.from(teleportTag.attributes).map(attr => [attr.name, attr.value])
            ),
            bounds: teleportTag.getBoundingClientRect()
          };
        }
      };
      
      // Auto-ready detection after page load
      window.addEventListener('load', () => {
        setTimeout(() => {
          if (!window.__TELEPORTATION__.ready) {
            console.log('🚀 Auto-detecting <teleport> tag...');
            const teleportContent = window.__TELEPORTATION__.extractTeleportTag();
            if (teleportContent) {
              window.__TELEPORTATION__.signalReady({
                type: 'teleport-tag',
                content: teleportContent.html,
                attributes: teleportContent.attributes,
                timestamp: Date.now()
              });
            } else {
              console.log('❌ No <teleport> tag found');
            }
          }
        }, opts.autoDetectDelay || 2000);
      });
      
    }, options);
  }

  async waitForTeleportationReady(page, options) {
    const timeout = options.readyTimeout || this.renderTimeout;
    
    try {
      // Wait for teleportation ready signal
      const teleportData = await page.evaluate(async (timeoutMs) => {
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Teleportation ready timeout'));
          }, timeoutMs);
          
          // Listen for ready signal
          window.addEventListener('teleportationReady', (event) => {
            clearTimeout(timeoutId);
            resolve(event.detail);
          });
          
          // Check if already ready
          if (window.__TELEPORTATION__ && window.__TELEPORTATION__.ready) {
            clearTimeout(timeoutId);
            resolve(window.__TELEPORTATION__.data);
          }
        });
      }, timeout);

      // Extract additional metadata
      const metadata = await page.evaluate(() => ({
        title: document.title,
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        timestamp: Date.now()
      }));

      // If we have structured data, extract it cleanly
      if (teleportData && teleportData.content) {
        return {
          valid: true,
          type: 'headless-rendered',
          ...teleportData,
          metadata,
          extractedAt: new Date().toISOString()
        };
      }

      // Fallback: extract the entire rendered page
      const fullHTML = await page.content();
      return {
        valid: true,
        type: 'full-page',
        content: fullHTML,
        metadata,
        extractedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Failed to wait for teleportation ready:', error);
      
      // Fallback extraction
      const fallbackContent = await page.evaluate(() => {
        const teleportTag = document.querySelector('teleport');
        if (teleportTag) {
          return {
            html: teleportTag.innerHTML,
            attributes: Object.fromEntries(
              Array.from(teleportTag.attributes).map(attr => [attr.name, attr.value])
            )
          };
        }
        return null;
      });
      
      if (fallbackContent) {
        return {
          valid: true,
          type: 'fallback-teleport-tag',
          content: fallbackContent.html,
          attributes: fallbackContent.attributes,
          error: error.message,
          extractedAt: new Date().toISOString()
        };
      }
      
      throw error;
    }
  }

  getCacheKey(url, options) {
    const optionsStr = JSON.stringify(options);
    return crypto.createHash('md5').update(url + optionsStr).digest('hex');
  }

  async clearCache() {
    this.cache.clear();
  }

  async shutdown() {
    await Promise.all(this.browserPool.map(browser => browser.close()));
    this.browserPool = [];
    this.initialized = false;
  }

  // Health check method
  async healthCheck() {
    try {
      const browser = await this.getBrowser();
      const page = await browser.newPage();
      await page.goto('data:text/html,<html><body><teleport>test</teleport></body></html>');
      const hasTag = await page.evaluate(() => !!document.querySelector('teleport'));
      await page.close();
      await this.returnBrowser(browser);
      return { healthy: hasTag, browsers: this.browserPool.length };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }
}

// Utility functions
function isValidTeleportURL(url) {
  try {
    const parsed = new URL(url);
    // Add your URL validation logic here
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Express middleware for handling headless teleportation
async function createTeleportationMiddleware(options = {}) {
  const teleporter = new HeadlessBrowserTeleporter(options);
  await teleporter.initialize();
  
  return {
    // The actual middleware function
    middleware: async (req, res, next) => {
      try {
        const uuid = req.params.uuid;
        const timestamp = req.query.timestamp;
        const hash = req.query.hash;
        const signature = req.query.signature;
        const url = req.query.url;

        // Authenticate user (you'll need to implement this)
        const isAuthenticated = await authenticateUser(uuid, timestamp, hash, signature);
        if (!isAuthenticated) {
          return res.status(403).json({error: 'Authentication failed'});
        }

        // Validate URL
        if (!isValidTeleportURL(url)) {
          return res.status(400).json({error: 'Invalid teleport URL'});
        }

        // Use headless browser to render and extract
        const result = await teleporter.teleportFromURL(url, {
          readyTimeout: 15000,
          autoDetectDelay: 3000,
          viewport: {
            width: parseInt(req.query.width) || 1200,
            height: parseInt(req.query.height) || 800
          }
        });
        
        res.json(result);
        
      } catch (error) {
        console.error('Headless teleportation failed:', error);
        res.status(500).json({
          error: 'Teleportation failed',
          details: error.message
        });
      }
    },
    
    // Utility methods
    teleporter: teleporter,
    
    // Cleanup method
    shutdown: async () => {
      await teleporter.shutdown();
    }
  };
}

// Stub authentication function - implement according to your auth system
async function authenticateUser(uuid, timestamp, hash, signature) {
  // Implement your authentication logic here
  // This should match your existing continuebee authentication
  console.log('Authenticating user:', uuid);
  return true; // Placeholder
}

// Main headlessBrowser object export
const headlessBrowser = {
  // Create a new teleporter instance
  createTeleporter: (options = {}) => new HeadlessBrowserTeleporter(options),
  
  // Create Express middleware
  createMiddleware: createTeleportationMiddleware,
  
  // Utility functions
  isValidURL: isValidTeleportURL,
  
  // Quick teleport function for one-off uses
  teleport: async (url, options = {}) => {
    const teleporter = new HeadlessBrowserTeleporter(options);
    try {
      await teleporter.initialize();
      return await teleporter.teleportFromURL(url, options);
    } finally {
      await teleporter.shutdown();
    }
  },
  
  // Version info
  version: '1.0.0'
};

module.exports = {
  headlessBrowser,
  HeadlessBrowserTeleporter,
  createTeleportationMiddleware,
  isValidTeleportURL
};
