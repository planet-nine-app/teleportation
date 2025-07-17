// demo-server.js
// Demo server that teleports content from Ye Olde Appe Shoppe
// Updated with side-by-side layout: Appe Shoppe (2/3) + Teleportation Demo (1/3)

const express = require('express');
const path = require('path');

// Try to import the headless browser module with error handling
let headlessBrowser;
try {
  const teleporterModule = require('./headless-browser-teleporter');
  console.log('📦 Available exports:', Object.keys(teleporterModule));
  headlessBrowser = teleporterModule.headlessBrowser;
  
  if (!headlessBrowser) {
    console.error('❌ headlessBrowser not found in exports');
    console.log('Available:', teleporterModule);
    process.exit(1);
  }
  
  console.log('✅ headlessBrowser imported successfully');
  console.log('Available methods:', Object.keys(headlessBrowser));
  
} catch (error) {
  console.error('❌ Failed to import headless-browser-teleporter:', error.message);
  console.error('Make sure headless-browser-teleporter.js is in the same directory');
  process.exit(1);
}

const app = express();
const port = 3001;

// Serve static files from the ye-olde-appe-shoppe directory
app.use('/ye-olde-appe-shoppe', express.static(path.join(__dirname, 'ye-olde-appe-shoppe')));

// Also serve individual files for the appe shoppe
app.use('/pn-post-component.css', express.static(path.join(__dirname, 'pn-post-component.css')));
app.use('/bn-button-container.css', express.static(path.join(__dirname, 'bn-button-container.css')));
app.use('/fn-form-component.css', express.static(path.join(__dirname, 'fn-form-component.css')));
app.use('/pn-post-component.js', express.static(path.join(__dirname, 'pn-post-component.js')));
app.use('/bn-button-container.js', express.static(path.join(__dirname, 'bn-button-container.js')));
app.use('/fn-form-component.js', express.static(path.join(__dirname, 'fn-form-component.js')));
app.use('/hn-header-or-footer.js', express.static(path.join(__dirname, 'hn-header-or-footer.js')));
app.use('/vs-vertical-stack.js', express.static(path.join(__dirname, 'vs-vertical-stack.js')));
app.use('/allyabase-web.js', express.static(path.join(__dirname, 'allyabase-web.js')));
app.use('/allyabase-tauri.js', express.static(path.join(__dirname, 'allyabase-tauri.js')));
app.use('/app-shoppe-logic.js', express.static(path.join(__dirname, 'app-shoppe-logic.js')));

// Demo page with side-by-side layout
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 Teleportation Demo - Live Side-by-Side</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: #f8fafc;
            height: 100vh;
            overflow: hidden;
        }
        
        .demo-header {
            background: linear-gradient(90deg, #7c3aed 0%, #059669 100%);
            padding: 15px 20px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.6);
            border-bottom: 3px solid #ec4899;
            position: relative;
            z-index: 1000;
        }
        
        .demo-title {
            font-family: 'Cinzel Decorative', serif;
            font-size: 1.8rem;
            font-weight: 700;
            color: #ffffff;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.8);
            margin: 0;
        }
        
        .demo-subtitle {
            font-size: 0.9rem;
            color: #fbbf24;
            font-style: italic;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
            margin: 5px 0 0 0;
        }
        
        .main-layout {
            display: flex;
            height: calc(100vh - 80px);
        }
        
        .appe-shoppe-panel {
            width: 66.67%;
            background: #ffffff;
            border-right: 3px solid #ec4899;
            position: relative;
            overflow: hidden;
        }
        
        .shoppe-header {
            background: linear-gradient(90deg, #0316FC 0%, #FCFC03 100%);
            padding: 10px 20px;
            color: #1f2937;
            font-weight: bold;
            text-align: center;
            border-bottom: 2px solid #7C7C7C;
            position: relative;
            z-index: 100;
        }
        
        .shoppe-iframe {
            width: 100%;
            height: calc(100% - 50px);
            border: none;
            background: #E1E0DD;
        }
        
        .teleportation-panel {
            width: 33.33%;
            background: rgba(45, 27, 105, 0.95);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .teleport-header {
            background: rgba(124, 58, 237, 0.9);
            color: #ffffff;
            padding: 15px 20px;
            border-bottom: 2px solid #ec4899;
            text-align: center;
        }
        
        .teleport-header h2 {
            margin: 0;
            font-size: 1.2rem;
            font-weight: 700;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        
        .teleport-controls {
            padding: 20px;
            background: rgba(45, 27, 105, 0.4);
            border-bottom: 2px solid #7c3aed;
        }
        
        .teleport-url-input {
            width: 100%;
            padding: 12px;
            background: #1e1e2e;
            border: 2px solid #7c3aed;
            border-radius: 8px;
            color: #f8f8f2;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            margin-bottom: 15px;
            box-sizing: border-box;
        }
        
        .teleport-url-input:focus {
            outline: none;
            border-color: #ec4899;
            box-shadow: 0 0 15px rgba(236, 72, 153, 0.4);
        }
        
        .teleport-button {
            width: 100%;
            background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
            color: white;
            border: 2px solid #7c3aed;
            padding: 12px 20px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            font-size: 14px;
        }
        
        .teleport-button:hover {
            background: linear-gradient(135deg, #8b5cf6 0%, #f472b6 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(124, 58, 237, 0.4);
        }
        
        .teleport-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .status-area {
            padding: 20px;
            flex: 1;
            overflow-y: auto;
            background: rgba(45, 27, 105, 0.2);
        }
        
        .status {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 15px;
            font-weight: 500;
            font-size: 14px;
        }
        
        .status.loading {
            background: rgba(251, 191, 36, 0.3);
            color: #fbbf24;
            border: 1px solid #fcd34d;
        }
        
        .status.success {
            background: rgba(16, 185, 129, 0.3);
            color: #10b981;
            border: 1px solid #86efac;
        }
        
        .status.error {
            background: rgba(239, 68, 68, 0.3);
            color: #ef4444;
            border: 1px solid #fca5a5;
        }
        
        .teleported-content {
            background: rgba(45, 27, 105, 0.4);
            border: 2px dashed #7c3aed;
            border-radius: 12px;
            padding: 20px;
            min-height: 200px;
            max-height: 400px;
            overflow-y: auto;
            color: #e5e7eb;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .teleported-content.has-content {
            border-color: #10b981;
            background: rgba(16, 185, 129, 0.1);
        }
        
        .metadata {
            background: rgba(30, 30, 46, 0.8);
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
            font-size: 12px;
            color: #a78bfa;
            font-family: 'Courier New', monospace;
        }
        
        .metadata h4 {
            color: #ec4899;
            margin: 0 0 10px 0;
            font-size: 14px;
        }
        
        .auto-teleport-notice {
            background: rgba(16, 185, 129, 0.2);
            border: 1px solid #10b981;
            color: #10b981;
            padding: 10px;
            border-radius: 6px;
            font-size: 12px;
            margin-bottom: 15px;
            text-align: center;
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: rgba(45, 27, 105, 0.4);
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #7c3aed 0%, #ec4899 100%);
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #8b5cf6 0%, #f472b6 100%);
        }
        
        .pn-post-card {
            margin-bottom: 15px !important;
            transform: scale(0.9) !important;
            border: 1px solid #7c3aed !important;
        }
    </style>
</head>
<body>
    <div class="demo-header">
        <h1 class="demo-title">🚀 Live Teleportation Demo 🏰</h1>
        <p class="demo-subtitle">Watch content teleport from Ye Olde Appe Shoppe in real-time!</p>
    </div>

    <div class="main-layout">
        <!-- Ye Olde Appe Shoppe Panel (2/3 width) -->
        <div class="appe-shoppe-panel">
            <div class="shoppe-header">
                🏰 Ye Olde Appe Shoppe - Source Application (Light Theme)
            </div>
            <iframe 
                class="shoppe-iframe" 
                src="/ye-olde-appe-shoppe/ye-olde-appe-shoppe.html"
                title="Ye Olde Appe Shoppe">
            </iframe>
        </div>

        <!-- Teleportation Demo Panel (1/3 width) -->
        <div class="teleportation-panel">
            <div class="teleport-header">
                <h2>📡 Teleportation Interface</h2>
            </div>
            
            <div class="teleport-controls">
                <input 
                    type="text" 
                    id="teleportUrl" 
                    class="teleport-url-input"
                    value="http://localhost:3001/ye-olde-appe-shoppe/ye-olde-appe-shoppe.html" 
                    placeholder="URL to teleport from">
                <button 
                    id="teleportButton" 
                    class="teleport-button" 
                    onclick="performTeleportation()">
                    🚀 Teleport Content
                </button>
            </div>
            
            <div class="status-area">
                <div class="auto-teleport-notice">
                    ✨ Auto-teleportation will start in 3 seconds...
                </div>
                
                <div id="status" class="status" style="display: none;"></div>
                
                <h3 style="color: #ec4899; margin: 0 0 15px 0; font-size: 16px;">📥 Teleported Content:</h3>
                <div id="teleportedContent" class="teleported-content">
                    <p style="text-align: center; color: #a78bfa; margin-top: 4rem;">
                        🌌 Preparing teleportation chamber...
                    </p>
                </div>
                
                <div id="metadata" class="metadata" style="display: none;"></div>
            </div>
        </div>
    </div>
    
    <script>
        let teleportationInProgress = false;
        
        async function performTeleportation() {
            if (teleportationInProgress) return;
            
            const url = document.getElementById('teleportUrl').value;
            const statusEl = document.getElementById('status');
            const contentEl = document.getElementById('teleportedContent');
            const metadataEl = document.getElementById('metadata');
            const buttonEl = document.getElementById('teleportButton');
            
            teleportationInProgress = true;
            buttonEl.disabled = true;
            buttonEl.textContent = '🔄 Teleporting...';
            
            // Show loading state
            statusEl.style.display = 'block';
            statusEl.className = 'status loading';
            statusEl.textContent = '🔄 Initializing headless browser and teleporting content...';
            
            try {
                const response = await fetch('/teleport', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url })
                });
                
                const result = await response.json();
                
                if (result.valid) {
                    // Success
                    statusEl.className = 'status success';
                    statusEl.textContent = '✅ Teleportation successful! Content extracted from <teleport> tags.';
                    
                    // Display content
                    contentEl.innerHTML = result.content;
                    contentEl.classList.add('has-content');
                    
                    // Display metadata
                    metadataEl.style.display = 'block';
                    metadataEl.innerHTML = \`
                        <h4>📊 Teleportation Metadata</h4>
                        <strong>Type:</strong> \${result.type}<br>
                        <strong>Attributes:</strong><br>
                        <pre>\${JSON.stringify(result.attributes, null, 2)}</pre>
                        <strong>Extracted At:</strong> \${result.extractedAt}<br>
                        <strong>Source URL:</strong> \${result.metadata?.url || 'N/A'}<br>
                        <strong>Page Title:</strong> \${result.metadata?.title || 'N/A'}
                    \`;
                    
                } else {
                    throw new Error(result.error || 'Teleportation failed');
                }
                
            } catch (error) {
                // Error
                statusEl.className = 'status error';
                statusEl.textContent = '❌ Teleportation failed: ' + error.message;
                
                contentEl.innerHTML = \`
                    <p style="text-align: center; color: #ef4444; margin-top: 4rem;">
                        💥 Teleportation chamber malfunction!<br>
                        <small>\${error.message}</small>
                    </p>
                \`;
                contentEl.classList.remove('has-content');
                
                metadataEl.style.display = 'none';
            } finally {
                teleportationInProgress = false;
                buttonEl.disabled = false;
                buttonEl.textContent = '🚀 Teleport Content';
            }
        }
        
        // Auto-teleport after page load
        window.addEventListener('load', () => {
            let countdown = 3;
            const noticeEl = document.querySelector('.auto-teleport-notice');
            
            const countdownTimer = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    noticeEl.textContent = \`✨ Auto-teleportation will start in \${countdown} second\${countdown !== 1 ? 's' : ''}...\`;
                } else {
                    noticeEl.textContent = '🚀 Starting auto-teleportation...';
                    clearInterval(countdownTimer);
                    
                    setTimeout(() => {
                        noticeEl.style.display = 'none';
                        console.log('🚀 Auto-performing teleportation...');
                        performTeleportation();
                    }, 500);
                }
            }, 1000);
        });
        
        // Allow Enter key to trigger teleportation
        document.getElementById('teleportUrl').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !teleportationInProgress) {
                performTeleportation();
            }
        });
    </script>
</body>
</html>
  `);
});

// Teleportation endpoint (unchanged)
app.post('/teleport', express.json(), async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    console.log('🚀 Teleporting from:', url);
    
    // Verify headlessBrowser has the teleport method
    if (!headlessBrowser || typeof headlessBrowser.teleport !== 'function') {
      console.error('❌ headlessBrowser.teleport is not available');
      console.log('headlessBrowser:', headlessBrowser);
      return res.status(500).json({ 
        error: 'Teleportation service not available',
        details: 'headlessBrowser.teleport method not found'
      });
    }
    
    // Use the headless browser to teleport
    const result = await headlessBrowser.teleport(url, {
      readyTimeout: 25000,     // 25 seconds - longer for complex pages
      autoDetectDelay: 5000,   // 5 seconds before auto-detection
      viewport: {
        width: 1200,
        height: 800
      }
    });
    
    console.log('✅ Teleportation result:', {
      valid: result.valid,
      type: result.type,
      contentLength: result.content?.length || 0,
      hasAttributes: !!result.attributes
    });
    
    res.json(result);
    
  } catch (error) {
    console.error('❌ Teleportation error:', error);
    res.status(500).json({
      error: 'Teleportation failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    if (!headlessBrowser || typeof headlessBrowser.createTeleporter !== 'function') {
      return res.status(500).json({
        service: 'teleportation-demo',
        healthy: false,
        error: 'headlessBrowser not properly imported'
      });
    }
    
    // Create a temporary teleporter for health check
    const teleporter = headlessBrowser.createTeleporter();
    await teleporter.initialize();
    
    const health = await teleporter.healthCheck();
    await teleporter.shutdown();
    
    res.json({
      service: 'teleportation-demo',
      ...health,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      service: 'teleportation-demo',
      healthy: false,
      error: error.message
    });
  }
});

// API endpoint for external testing
app.get('/api/teleport', async (req, res) => {
  try {
    const url = req.query.url;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    if (!headlessBrowser || typeof headlessBrowser.teleport !== 'function') {
      return res.status(500).json({ 
        error: 'Teleportation service not available',
        details: 'headlessBrowser.teleport method not found'
      });
    }
    
    const result = await headlessBrowser.teleport(url, {
      readyTimeout: parseInt(req.query.timeout) || 20000,  // Default 20 seconds
      viewport: {
        width: parseInt(req.query.width) || 1200,
        height: parseInt(req.query.height) || 800
      },
      autoDetectDelay: 5000  // 5 seconds before auto-detection
    });
    
    res.json(result);
    
  } catch (error) {
    res.status(500).json({
      error: 'Teleportation failed',
      details: error.message
    });
  }
});

// Add this route to your demo-server.js
// Make sure you have: const path = require('path');

// Sample teleportation feed data
const sampleFeed = {
  id: "demo-feed-001",
  title: "Demo Store Product Feed",
  description: "A sample feed of products for teleportation discovery",
  lastUpdated: new Date().toISOString(),
  teleportals: [
    {
      id: "teleportal-001",
      title: "Amazing Spatula Set",
      description: "Perfect for getting every last bit out of containers",
      price: "$19.99",
      category: "kitchen",
      url: "https://example.com/products/spatula-set",
      imageUrl: "https://example.com/images/spatula.jpg",
      discoverable: true,
      tags: ["kitchen", "tools", "spatula", "cooking"]
    },
    {
      id: "teleportal-002", 
      title: "Non-Stick Cooking Spray",
      description: "Works great with spatulas for easy cleanup",
      price: "$7.99",
      category: "kitchen",
      url: "https://example.com/products/cooking-spray",
      imageUrl: "https://example.com/images/spray.jpg", 
      discoverable: true,
      tags: ["kitchen", "cooking", "non-stick"]
    },
    {
      id: "teleportal-003",
      title: "Kitchen Starter Bundle", 
      description: "Everything you need to get started cooking",
      price: "$49.99",
      category: "kitchen",
      url: "https://example.com/products/starter-bundle",
      imageUrl: "https://example.com/images/bundle.jpg",
      discoverable: true,
      tags: ["kitchen", "bundle", "starter", "cooking"]
    }
  ]
};

// Route to get the teleportation feed
app.get('/api/teleport/feed', (req, res) => {
  try {
    // Add CORS headers for cross-origin teleportation
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    // Optional filtering by category or tag
    const { category, tag, search } = req.query;
    let filteredFeed = { ...sampleFeed };
    
    if (category || tag || search) {
      filteredFeed.teleportals = sampleFeed.teleportals.filter(teleportal => {
        if (category && teleportal.category !== category) return false;
        if (tag && !teleportal.tags.includes(tag)) return false;
        if (search) {
          const searchLower = search.toLowerCase();
          return teleportal.title.toLowerCase().includes(searchLower) ||
                 teleportal.description.toLowerCase().includes(searchLower) ||
                 teleportal.tags.some(t => t.toLowerCase().includes(searchLower));
        }
        return true;
      });
    }
    
    res.json(filteredFeed);
  } catch (error) {
    console.error('Error serving teleportation feed:', error);
    res.status(500).json({ error: 'Failed to load teleportation feed' });
  }
});

// Route to get a specific teleportal by ID
app.get('/api/teleport/teleportal/:id', (req, res) => {
  try {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    const teleportal = sampleFeed.teleportals.find(t => t.id === req.params.id);
    
    if (!teleportal) {
      return res.status(404).json({ error: 'Teleportal not found' });
    }
    
    res.json(teleportal);
  } catch (error) {
    console.error('Error serving teleportal:', error);
    res.status(500).json({ error: 'Failed to load teleportal' });
  }
});

// Route to serve the demo HTML page
app.get('/demo/teleport', (req, res) => {
  res.sendFile(path.join(__dirname, 'teleport-demo.html'));
});

// Add this if you want to support teleportation discovery
app.get('/.well-known/teleportation', (req, res) => {
  res.json({
    version: "1.0",
    feeds: [
      {
        url: "/api/teleport/feed",
        title: "Demo Store Feed",
        description: "Sample products for teleportation discovery"
      }
    ]
  });
});

// Route to extract and serve embedded teleport feed as JSON
app.get('/api/teleport/embedded-feed', (req, res) => {
  try {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    // This represents the embedded feed from the HTML page
    const embeddedFeed = {
      id: "demo-store-feed",
      title: "Demo Store - Kitchen Essentials",
      description: "Amazing kitchen tools and gadgets for the modern cook",
      lastUpdated: new Date().toISOString(),
      sourceUrl: "https://demo-store.example.com",
      teleportals: [
        {
          id: "spatula-pro",
          title: "Professional Spatula Set",
          description: "Get every last drop with our premium spatula collection. Perfect for jars, bottles, and containers.",
          price: "$19.99",
          category: "kitchen",
          url: "https://demo-store.example.com/spatula-pro",
          imageUrl: "https://demo-store.example.com/images/spatula-pro.jpg",
          tags: ["kitchen", "tools", "spatula", "cooking", "professional"],
          inStock: true,
          rating: 4.8,
          discoverable: true
        },
        {
          id: "silicone-scraper", 
          title: "Silicone Bowl Scraper",
          description: "Flexible silicone scraper that gets into every corner. Heat resistant up to 450°F.",
          price: "$12.99",
          category: "kitchen",
          url: "https://demo-store.example.com/silicone-scraper",
          imageUrl: "https://demo-store.example.com/images/scraper.jpg",
          tags: ["kitchen", "silicone", "scraper", "baking", "heat-resistant"],
          inStock: true,
          rating: 4.6,
          discoverable: true
        },
        {
          id: "jar-opener",
          title: "Universal Jar Opener", 
          description: "Never struggle with stuck jars again! Works on any size jar or bottle.",
          price: "$24.99",
          category: "kitchen",
          url: "https://demo-store.example.com/jar-opener",
          imageUrl: "https://demo-store.example.com/images/jar-opener.jpg",
          tags: ["kitchen", "opener", "jar", "accessibility", "universal"],
          inStock: true,
          rating: 4.9,
          discoverable: true
        },
        {
          id: "kitchen-bundle",
          title: "Complete Kitchen Starter Kit",
          description: "Everything you need: spatulas, scrapers, jar opener, and measuring spoons. Save 25%!",
          price: "$49.99", 
          category: "kitchen",
          url: "https://demo-store.example.com/kitchen-bundle",
          imageUrl: "https://demo-store.example.com/images/bundle.jpg",
          tags: ["kitchen", "bundle", "starter", "complete", "savings"],
          inStock: true,
          rating: 4.7,
          specialOffer: "25% off when bought together",
          discoverable: true
        }
      ]
    };

    res.json(embeddedFeed);
  } catch (error) {
    console.error('Error serving embedded teleportation feed:', error);
    res.status(500).json({ error: 'Failed to load embedded teleportation feed' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Live Teleportation Demo Server running at http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🏰 Ye Olde Appe Shoppe: http://localhost:${port}/ye-olde-appe-shoppe/ye-olde-appe-shoppe.html`);
  console.log(`🌐 Live Demo: http://localhost:${port}/`);
  console.log(`✨ Side-by-side teleportation demo ready!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down demo server...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Shutting down demo server...');
  process.exit(0);
});
