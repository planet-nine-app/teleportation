// demo-server.js
// Demo server that teleports content from Ye Olde Appe Shoppe

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

// Serve static files (for hosting Ye Olde Appe Shoppe locally)
app.use('/shoppe', express.static(path.join(__dirname, 'ye-olde-appe-shoppe')));

// Demo page that shows teleported content
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teleportation Demo</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f8fafc;
        }
        
        .header {
            text-align: center;
            margin-bottom: 2rem;
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .demo-section {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .teleport-controls {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            align-items: center;
        }
        
        .teleport-controls input {
            flex: 1;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
        }
        
        .teleport-controls button {
            padding: 12px 24px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        }
        
        .teleport-controls button:hover {
            background: #2563eb;
        }
        
        .status {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-weight: 500;
        }
        
        .status.loading {
            background: #fef3c7;
            color: #92400e;
            border: 1px solid #fcd34d;
        }
        
        .status.success {
            background: #dcfce7;
            color: #166534;
            border: 1px solid #86efac;
        }
        
        .status.error {
            background: #fee2e2;
            color: #dc2626;
            border: 1px solid #fca5a5;
        }
        
        .teleported-content {
            border: 2px dashed #3b82f6;
            border-radius: 12px;
            padding: 1rem;
            min-height: 200px;
            background: #f8fafc;
        }
        
        .metadata {
            background: #f3f4f6;
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
            font-size: 14px;
            color: #6b7280;
        }
        
        .iframe-container {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Teleportation Demo</h1>
        <p>Extract content from Ye Olde Appe Shoppe using headless browser teleportation</p>
    </div>
    
    <div class="demo-section">
        <h2>🏰 Source: Ye Olde Appe Shoppe</h2>
        <p>This is the original Ye Olde Appe Shoppe running with teleport tags:</p>
        <div class="iframe-container">
            <iframe src="/shoppe/ye-olde-appe-shoppe.html" width="100%" height="600" frameborder="0"></iframe>
        </div>
        <p><em>The post feed in the preview above is wrapped in &lt;teleport&gt; tags</em></p>
    </div>
    
    <div class="demo-section">
        <h2>📡 Teleportation Controls</h2>
        <div class="teleport-controls">
            <input type="text" id="teleportUrl" value="http://localhost:3001/shoppe/ye-olde-appe-shoppe.html" placeholder="URL to teleport from">
            <button onclick="performTeleportation()">🚀 Teleport Content</button>
        </div>
        
        <div id="status" class="status" style="display: none;"></div>
        
        <h3>📥 Teleported Content:</h3>
        <div id="teleportedContent" class="teleported-content">
            <p style="text-align: center; color: #6b7280; margin-top: 4rem;">
                Click "Teleport Content" to extract content from the source
            </p>
        </div>
        
        <div id="metadata" class="metadata" style="display: none;"></div>
    </div>
    
    <script>
        async function performTeleportation() {
            const url = document.getElementById('teleportUrl').value;
            const statusEl = document.getElementById('status');
            const contentEl = document.getElementById('teleportedContent');
            const metadataEl = document.getElementById('metadata');
            
            // Show loading state
            statusEl.style.display = 'block';
            statusEl.className = 'status loading';
            statusEl.textContent = '🔄 Teleporting content...';
            
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
                    statusEl.textContent = '✅ Teleportation successful!';
                    
                    // Display content
                    contentEl.innerHTML = result.content;
                    
                    // Display metadata
                    metadataEl.style.display = 'block';
                    metadataEl.innerHTML = \`
                        <strong>Metadata:</strong><br>
                        Type: \${result.type}<br>
                        Attributes: \${JSON.stringify(result.attributes, null, 2)}<br>
                        Extracted at: \${result.extractedAt}<br>
                        Source: \${result.metadata?.url}<br>
                        Title: \${result.metadata?.title}
                    \`;
                    
                } else {
                    throw new Error(result.error || 'Teleportation failed');
                }
                
            } catch (error) {
                // Error
                statusEl.className = 'status error';
                statusEl.textContent = '❌ Teleportation failed: ' + error.message;
                
                contentEl.innerHTML = \`
                    <p style="text-align: center; color: #dc2626; margin-top: 4rem;">
                        Teleportation failed. Check the URL and try again.
                    </p>
                \`;
                
                metadataEl.style.display = 'none';
            }
        }
        
        // Auto-load demo on page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                console.log('Auto-performing demo teleportation...');
                performTeleportation();
            }, 2000);
        });
    </script>
</body>
</html>
  `);
});

// Teleportation endpoint
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

// Start server
app.listen(port, () => {
  console.log(`🚀 Teleportation Demo Server running at http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🏰 Ye Olde Appe Shoppe: http://localhost:${port}/shoppe/ye-olde-appe-shoppe.html`);
  console.log(`🌐 Demo page: http://localhost:${port}/`);
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
