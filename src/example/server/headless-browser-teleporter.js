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
console.log('###### setupTeleportationAPI has been called');
    // Inject teleportation API into the page
try {
    await page.evaluateOnNewDocument((opts) => {
console.log('[][][][] page has been evaluated');
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
console.log('Defining auto detection');
      
      // Auto-ready detection - handle both loaded and loading states
      function setupAutoDetection() {
console.log('&*^%$^@ running setup auto detection');
        function runAutoDetection() {
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
              console.log('❌ No <teleport> tag found in auto-detection');
            }
          }
        }
        
        // Check if page is already loaded
        if (document.readyState === 'complete') {
          console.log('📄 Document already loaded, running auto-detection immediately');
          setTimeout(runAutoDetection, opts.autoDetectDelay || 2000);
        } else if (document.readyState === 'interactive') {
          console.log('📄 Document interactive, running auto-detection soon');
          setTimeout(runAutoDetection, Math.min(opts.autoDetectDelay || 2000, 1000));
        } else {
          console.log('📄 Document still loading, waiting for load event');
          window.addEventListener('load', () => {
            setTimeout(runAutoDetection, opts.autoDetectDelay || 2000);
          });
        }
        
        // Also listen for DOMContentLoaded as a backup
        if (document.readyState === 'loading') {
          window.addEventListener('DOMContentLoaded', () => {
            console.log('📄 DOM content loaded, trying auto-detection');
            setTimeout(runAutoDetection, Math.min(opts.autoDetectDelay || 2000, 1500));
          });
        }
      }
      
      // Start auto-detection setup
      setupAutoDetection();
      
      // Also do an immediate check in case teleport tag already exists
      setTimeout(() => {
        if (!window.__TELEPORTATION__.ready) {
          console.log('🔍 Immediate teleport tag check...');
          const teleportContent = window.__TELEPORTATION__.extractTeleportTag();
          if (teleportContent) {
            console.log('✅ Found teleport tag in immediate check');
            window.__TELEPORTATION__.signalReady({
              type: 'immediate-teleport-tag',
              content: teleportContent.html,
              attributes: teleportContent.attributes,
              timestamp: Date.now()
            });
          }
        }
      }, 500); // Very short delay to allow DOM to settle
      
    }, options);
} catch(err) {
console.warn('That await you wrapped is erroring with this: ', err);
}
  }

  async waitForTeleportationReady(page, options) {
    const timeout = options.readyTimeout || this.renderTimeout;
    
    // First, let's debug what's on the page
    console.log('🔍 Debugging page content...');
    
    const pageInfo = await page.evaluate(() => {
      const teleportTag = document.querySelector('teleport');
      return {
        title: document.title,
        url: window.location.href,
        hasTeleportTag: !!teleportTag,
        teleportTagContent: teleportTag ? teleportTag.innerHTML.substring(0, 200) + '...' : null,
        teleportTagAttributes: teleportTag ? Object.fromEntries(
          Array.from(teleportTag.attributes).map(attr => [attr.name, attr.value])
        ) : null,
        bodyContent: document.body.innerHTML.substring(0, 500) + '...',
        hasTeportationAPI: typeof window.__TELEPORTATION__ !== 'undefined',
        teleportationReady: window.__TELEPORTATION__ ? window.__TELEPORTATION__.ready : false
      };
    });
    
    console.log('📊 Page debug info:', pageInfo);
    
    // If we found a teleport tag immediately, try to signal ready
    if (pageInfo.hasTeleportTag) {
      console.log('✅ Found teleport tag immediately, attempting ready signal...');
      
      try {
        const immediateResult = await page.evaluate(() => {
          const teleportTag = document.querySelector('teleport');
          if (teleportTag && window.__TELEPORTATION__) {
            const teleportData = {
              type: 'immediate-detection',
              content: teleportTag.innerHTML,
              attributes: Object.fromEntries(
                Array.from(teleportTag.attributes).map(attr => [attr.name, attr.value])
              ),
              timestamp: Date.now()
            };
            
            window.__TELEPORTATION__.signalReady(teleportData);
            return teleportData;
          }
          return null;
        });
        
        if (immediateResult) {
          console.log('✅ Immediate teleportation successful');
          
          const metadata = await page.evaluate(() => ({
            title: document.title,
            url: window.location.href,
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight
            },
            timestamp: Date.now()
          }));
          
          return {
            valid: true,
            type: 'immediate-detection',
            ...immediateResult,
            metadata,
            extractedAt: new Date().toISOString()
          };
        }
      } catch (err) {
        console.warn('⚠️ Immediate detection failed, falling back to timeout wait:', err.message);
      }
    }
    
    try {
      // Wait for teleportation ready signal with enhanced logging
      const teleportData = await page.evaluate(async (timeoutMs) => {
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            // Provide debug info on timeout
            const teleportTag = document.querySelector('teleport');
            const debugInfo = {
              hasTeleportTag: !!teleportTag,
              teleportTagHTML: teleportTag ? teleportTag.outerHTML.substring(0, 300) : 'No teleport tag',
              teleportationAPI: typeof window.__TELEPORTATION__ !== 'undefined',
              readyState: window.__TELEPORTATION__ ? window.__TELEPORTATION__.ready : 'No API',
              documentReady: document.readyState,
              imagesCount: document.querySelectorAll('img').length,
              scriptsCount: document.querySelectorAll('script').length
            };
            
            reject(new Error(`Teleportation ready timeout. Debug: ${JSON.stringify(debugInfo)}`));
          }, timeoutMs);
          
          // Listen for ready signal
          window.addEventListener('teleportationReady', (event) => {
            console.log('📡 Received teleportationReady event');
            clearTimeout(timeoutId);
            resolve(event.detail);
          });
          
          // Check if already ready
          if (window.__TELEPORTATION__ && window.__TELEPORTATION__.ready) {
            console.log('📡 Already ready, using existing data');
            clearTimeout(timeoutId);
            resolve(window.__TELEPORTATION__.data);
          }
          
          // Enhanced auto-detection with more aggressive retries
          let retryCount = 0;
          const maxRetries = 10; // Increased retries
          
          function tryAutoDetection() {
            retryCount++;
            console.log(`🔍 Auto-detection attempt ${retryCount}/${maxRetries}`);
            
            const teleportTag = document.querySelector('teleport');
            if (teleportTag) {
              console.log('✅ Found teleport tag in auto-detection');
              const teleportData = {
                type: 'auto-detected',
                content: teleportTag.innerHTML,
                attributes: Object.fromEntries(
                  Array.from(teleportTag.attributes).map(attr => [attr.name, attr.value])
                ),
                timestamp: Date.now(),
                detectionAttempt: retryCount
              };
              
              clearTimeout(timeoutId);
              resolve(teleportData);
              return;
            } else {
              console.log(`❌ No teleport tag found on attempt ${retryCount}`);
              
              // Debug: log what we do find
              const allElements = document.querySelectorAll('*');
              const elementTypes = [...new Set(Array.from(allElements).map(el => el.tagName.toLowerCase()))];
              console.log(`🔍 Available element types: ${elementTypes.slice(0, 10).join(', ')}${elementTypes.length > 10 ? '...' : ''}`);
              
              // Check for iframe content that might contain teleport tags
              const iframes = document.querySelectorAll('iframe');
              if (iframes.length > 0) {
                console.log(`🖼️ Found ${iframes.length} iframe(s), checking for teleport tags...`);
                for (let i = 0; i < iframes.length; i++) {
                  try {
                    const iframeDoc = iframes[i].contentDocument;
                    if (iframeDoc) {
                      const iframeTeleport = iframeDoc.querySelector('teleport');
                      if (iframeTeleport) {
                        console.log(`✅ Found teleport tag in iframe ${i}`);
                        const teleportData = {
                          type: 'iframe-teleport',
                          content: iframeTeleport.innerHTML,
                          attributes: Object.fromEntries(
                            Array.from(iframeTeleport.attributes).map(attr => [attr.name, attr.value])
                          ),
                          timestamp: Date.now(),
                          detectionAttempt: retryCount,
                          iframeIndex: i
                        };
                        
                        clearTimeout(timeoutId);
                        resolve(teleportData);
                        return;
                      }
                    }
                  } catch (e) {
                    console.log(`⚠️ Cannot access iframe ${i} content (cross-origin?):`, e.message);
                  }
                }
              }
            }
            
            if (retryCount < maxRetries) {
              setTimeout(tryAutoDetection, 1000); // Try again in 1 second
            } else {
              console.log(`❌ Exhausted all ${maxRetries} auto-detection attempts`);
            }
          }
          
          // Start auto-detection immediately, then with retries
          setTimeout(tryAutoDetection, 100); // Very quick first attempt
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
      
      // Enhanced fallback extraction with detailed logging
      console.log('🔄 Attempting enhanced fallback extraction...');
      
      const fallbackInfo = await page.evaluate(() => {
        const teleportTag = document.querySelector('teleport');
        
        const info = {
          teleportTag: null,
          allTeleportTags: document.querySelectorAll('teleport').length,
          documentReady: document.readyState,
          bodyHTML: document.body.innerHTML.substring(0, 1000),
          hasImages: document.querySelectorAll('img').length,
          hasScripts: document.querySelectorAll('script').length,
          errorDetails: 'No teleport tag found'
        };
        
        if (teleportTag) {
          info.teleportTag = {
            html: teleportTag.innerHTML,
            outerHTML: teleportTag.outerHTML.substring(0, 500),
            attributes: Object.fromEntries(
              Array.from(teleportTag.attributes).map(attr => [attr.name, attr.value])
            ),
            bounds: teleportTag.getBoundingClientRect(),
            hasContent: teleportTag.innerHTML.trim().length > 0
          };
          info.errorDetails = 'Teleport tag found but ready signal failed';
        }
        
        return info;
      });
      
      console.log('📊 Fallback debug info:', fallbackInfo);
      
      if (fallbackInfo.teleportTag && fallbackInfo.teleportTag.hasContent) {
        console.log('✅ Found teleport tag in fallback, using its content');
        return {
          valid: true,
          type: 'fallback-teleport-tag',
          content: fallbackInfo.teleportTag.html,
          attributes: fallbackInfo.teleportTag.attributes,
          error: error.message,
          debugInfo: fallbackInfo,
          extractedAt: new Date().toISOString()
        };
      }
      
      throw new Error(`Teleportation failed: ${error.message}. Debug: ${JSON.stringify(fallbackInfo)}`);
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
