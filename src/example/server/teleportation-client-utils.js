// teleportation-client-utils.js
// Client-side utilities for teleportation integration
// This code runs in the browser (either real or headless)

// Teleportation detection and utilities
const TeleportationClient = {
  
  // Check if we're in a teleportation context
  isTeleportationContext() {
    return typeof window !== 'undefined' && 
           window.__TELEPORTATION__ && 
           typeof window.__TELEPORTATION__.signalReady === 'function';
  },

  // Create and manage teleport tags
  createTeleportTag(content, attributes = {}) {
    if (typeof document === 'undefined') {
      console.warn('createTeleportTag called outside browser context');
      return null;
    }

    const teleportTag = document.createElement('teleport');
    
    // Set default attributes
    const defaultAttrs = {
      'data-created': new Date().toISOString(),
      'data-version': '1.0'
    };
    
    // Merge with provided attributes
    const allAttrs = { ...defaultAttrs, ...attributes };
    
    // Set attributes
    Object.entries(allAttrs).forEach(([key, value]) => {
      teleportTag.setAttribute(key, value);
    });
    
    // Set content
    if (typeof content === 'string') {
      teleportTag.innerHTML = content;
    } else if (content instanceof Element) {
      teleportTag.appendChild(content.cloneNode(true));
    }
    
    return teleportTag;
  },

  // Wrap existing content in a teleport tag
  wrapInTeleportTag(selector, attributes = {}) {
    if (typeof document === 'undefined') {
      console.warn('wrapInTeleportTag called outside browser context');
      return null;
    }

    const element = typeof selector === 'string' 
      ? document.querySelector(selector)
      : selector;
    
    if (!element) {
      console.warn('Element not found for teleport wrapping:', selector);
      return null;
    }

    const teleportTag = this.createTeleportTag(element.innerHTML, attributes);
    
    // Replace the original element with the teleport tag
    element.parentNode.replaceChild(teleportTag, element);
    
    return teleportTag;
  },

  // Setup ready detection for existing teleport tag
  setupReadyDetection(options = {}) {
    if (!this.isTeleportationContext()) {
      console.log('Not in teleportation context');
      return;
    }

    const teleportTag = document.querySelector('teleport');
    if (!teleportTag) {
      console.warn('No teleport tag found for ready detection');
      return;
    }

    this.waitForContentReady(teleportTag, options).then(() => {
      this.signalReady(teleportTag, options);
    });
  },

  // Wait for content to be ready (images loaded, etc.)
  async waitForContentReady(teleportTag, options = {}) {
    return new Promise((resolve) => {
      const images = teleportTag.querySelectorAll('img');
      const totalImages = images.length;
      
      if (totalImages === 0) {
        resolve();
        return;
      }

      let loadedImages = 0;
      
      const checkComplete = () => {
        loadedImages++;
        if (loadedImages >= totalImages) {
          resolve();
        }
      };

      images.forEach(img => {
        if (img.complete) {
          checkComplete();
        } else {
          img.addEventListener('load', checkComplete);
          img.addEventListener('error', checkComplete); // Count errors as loaded
        }
      });

      // Timeout fallback
      const timeout = options.contentTimeout || 5000;
      setTimeout(resolve, timeout);
    });
  },

  // Signal that teleportation is ready
  signalReady(teleportTag, options = {}) {
    if (!this.isTeleportationContext()) {
      console.warn('Cannot signal ready - not in teleportation context');
      return;
    }

    const teleportData = {
      type: options.type || 'generic',
      content: teleportTag.innerHTML,
      attributes: Object.fromEntries(
        Array.from(teleportTag.attributes).map(attr => [attr.name, attr.value])
      ),
      metadata: {
        url: window.location.href,
        title: document.title,
        timestamp: Date.now(),
        contentElements: teleportTag.children.length,
        ...options.metadata
      }
    };

    console.log('🚀 Signaling teleportation ready!');
    window.__TELEPORTATION__.signalReady(teleportData);
  },

  // Auto-detect and setup teleportation
  autoSetup(options = {}) {
    if (!this.isTeleportationContext()) {
      return;
    }

    // Check if teleport tag already exists
    let teleportTag = document.querySelector('teleport');
    
    if (!teleportTag && options.autoWrap) {
      // Try to find content to wrap
      const selectors = options.selectors || [
        '.post-feed', '.events-feed', '.content-feed',
        '[data-teleport]', '.teleport-content'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          teleportTag = this.wrapInTeleportTag(element, options.attributes);
          break;
        }
      }
    }

    if (teleportTag) {
      // Set up ready detection
      const delay = options.setupDelay || 1000;
      setTimeout(() => {
        this.setupReadyDetection(options);
      }, delay);
    } else {
      console.warn('No teleport tag found and auto-wrap failed');
    }
  }
};

// Ye Olde Appe Shoppe specific integration
const YeOldeAppeShoppe = {
  
  // Setup teleportation for the preview iframe
  setupPreviewTeleportation(previewDoc, config) {
    // Find the main content area
    const postsContainer = previewDoc.querySelector('.post-feed, #home-post-feed, #manage-post-feed');
    if (!postsContainer) {
      console.warn('No posts container found for teleportation');
      return;
    }

    // Create teleport tag with app-specific attributes
    const teleportTag = previewDoc.createElement('teleport');
    teleportTag.setAttribute('data-app', 'ye-olde-appe-shoppe');
    teleportTag.setAttribute('data-feed-type', 'posts');
    teleportTag.setAttribute('data-theme', config?.settings?.theme || 'dark');
    teleportTag.setAttribute('data-version', config?.version || '1.0.0');
    teleportTag.setAttribute('data-created', new Date().toISOString());

    // Copy content
    teleportTag.innerHTML = postsContainer.innerHTML;

    // Replace original container
    postsContainer.parentNode.replaceChild(teleportTag, postsContainer);

    // Inject ready detection script
    const script = previewDoc.createElement('script');
    script.textContent = `
      (function() {
        function checkTeleportReady() {
          const teleportTag = document.querySelector('teleport');
          if (!teleportTag) {
            console.warn('No teleport tag found');
            return;
          }

          // Wait for images
          const images = teleportTag.querySelectorAll('img');
          let loadedImages = 0;
          const totalImages = images.length;

          function signalReady() {
            console.log('🚀 Ye Olde Appe Shoppe teleport ready!');
            
            const teleportData = {
              type: 'ye-olde-appe-shoppe',
              content: teleportTag.innerHTML,
              attributes: Object.fromEntries(
                Array.from(teleportTag.attributes).map(attr => [attr.name, attr.value])
              ),
              metadata: {
                totalPosts: teleportTag.querySelectorAll('.pn-post-card').length,
                appName: getAppName(),
                extractedFrom: window.location.href,
                timestamp: Date.now()
              }
            };

            // Signal to parent window if available
            if (window.parent && window.parent.__TELEPORTATION__) {
              window.parent.__TELEPORTATION__.signalReady(teleportData);
            }

            // Also signal directly if in teleportation context
            if (window.__TELEPORTATION__) {
              window.__TELEPORTATION__.signalReady(teleportData);
            }
          }

          if (totalImages === 0) {
            signalReady();
            return;
          }

          images.forEach(img => {
            if (img.complete) {
              loadedImages++;
            } else {
              img.addEventListener('load', () => {
                loadedImages++;
                if (loadedImages >= totalImages) {
                  signalReady();
                }
              });
              img.addEventListener('error', () => {
                loadedImages++;
                if (loadedImages >= totalImages) {
                  signalReady();
                }
              });
            }
          });

          if (loadedImages >= totalImages) {
            signalReady();
          }
        }

        function getAppName() {
          const title = document.querySelector('h1, .hn-title, [data-app-name]');
          if (title) return title.textContent.trim();
          return 'Ye Olde Appe Shoppe';
        }

        // Start checking after a brief delay
        setTimeout(checkTeleportReady, 500);
      })();
    `;

    previewDoc.head.appendChild(script);
  },

  // Create a standalone teleport feed
  createDirectFeed(posts, config) {
    if (typeof document === 'undefined') {
      console.warn('createDirectFeed called outside browser context');
      return null;
    }

    const teleportTag = TeleportationClient.createTeleportTag('', {
      'data-app': 'ye-olde-appe-shoppe',
      'data-version': config?.version || '1.0.0',
      'data-theme': config?.settings?.theme || 'light',
      'data-direct-feed': 'true'
    });

    // Generate posts HTML
    const postsHTML = posts.map(post => this.generatePostHTML(post, config?.styling)).join('\n');
    
    teleportTag.innerHTML = `
      <div class="teleport-posts" style="
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: ${config?.styling?.sectionGap || '20px'};
        padding: ${config?.styling?.containerPadding || '20px'};
      ">
        ${postsHTML}
      </div>
    `;

    return teleportTag;
  },

  generatePostHTML(post, styling = {}) {
    return `
      <div class="pn-post-card" style="
        background: ${styling.colors?.background || '#ffffff'};
        border: 1px solid ${styling.colors?.border || '#e5e5e5'};
        border-radius: ${styling.containerBorderRadius || '12px'};
        padding: ${styling.containerPadding || '16px'};
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      ">
        ${post.imageUri ? `
          <img src="${post.imageUri}" alt="${post.name}" style="
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: ${styling.borderRadius || '8px'};
            margin-bottom: ${styling.sectionGap || '12px'};
          ">
        ` : ''}
        
        <h3 class="pn-post-name" style="
          font-size: ${styling.fontSizes?.name || '18px'};
          font-weight: ${styling.fontWeights?.name || '600'};
          color: ${styling.colors?.text || '#000000'};
          margin-bottom: ${styling.textGap || '8px'};
        ">${post.name}</h3>
        
        <p class="pn-post-description" style="
          font-size: ${styling.fontSizes?.description || '14px'};
          color: ${styling.colors?.textSecondary || '#666666'};
          margin-bottom: ${styling.sectionGap || '12px'};
          line-height: 1.4;
        ">${post.description}</p>
        
        ${post.dateTimes?.length ? `
          <div class="pn-post-datetime" style="
            font-size: ${styling.fontSizes?.datetime || '14px'};
            color: ${styling.colors?.accent || '#2563eb'};
            margin-bottom: ${styling.textGap || '8px'};
          ">📅 ${this.formatDateTime(post.dateTimes[0])}</div>
        ` : ''}
        
        <div class="pn-post-address" style="
          font-size: ${styling.fontSizes?.address || '12px'};
          color: ${styling.colors?.textSecondary || '#666666'};
          margin-bottom: ${styling.sectionGap || '12px'};
        ">📍 ${post.address?.line1}, ${post.address?.line2}</div>
        
        <button class="pn-post-button" style="
          background: ${styling.colors?.primary || '#3b82f6'};
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: ${styling.borderRadius || '8px'};
          font-weight: 600;
          cursor: pointer;
          width: 100%;
        ">${post.buttonText || 'View Event'}</button>
      </div>
    `;
  },

  formatDateTime(dateTime) {
    if (dateTime.startDateTime && dateTime.endDateTime) {
      const start = new Date(dateTime.startDateTime);
      const end = new Date(dateTime.endDateTime);
      return `${start.toLocaleDateString()} ${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`;
    }
    return 'TBD';
  }
};

// Browser environment exports
if (typeof window !== 'undefined') {
  window.TeleportationClient = TeleportationClient;
  window.YeOldeAppeShoppe = YeOldeAppeShoppe;
}

// Node.js environment exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TeleportationClient,
    YeOldeAppeShoppe
  };
}
