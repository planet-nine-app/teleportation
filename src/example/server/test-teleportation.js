// test-teleportation.js
// Test script to verify Ye Olde Appe Shoppe teleportation works

const { headlessBrowser } = require('./headless-browser-teleporter');
const express = require('express');
const path = require('path');

async function runTeleportationTest() {
  console.log('🧪 Starting Ye Olde Appe Shoppe Teleportation Test\n');
  
  // Step 1: Start a local server to serve Ye Olde Appe Shoppe
  const app = express();
  app.use(express.static(__dirname));
  
  const server = app.listen(8080, () => {
    console.log('📂 Local server started on http://localhost:8080');
  });
  
  try {
    // Step 2: Wait a moment for server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 3: Test teleportation
    console.log('🚀 Testing teleportation...');
    
    const testUrl = 'http://localhost:8080/ye-olde-appe-shoppe.html';
    console.log(`📡 Teleporting from: ${testUrl}`);
    
    const result = await headlessBrowser.teleport(testUrl, {
      readyTimeout: 20000,
      autoDetectDelay: 5000,
      viewport: {
        width: 1200,
        height: 800
      }
    });
    
    // Step 4: Analyze results
    console.log('\n📊 Teleportation Results:');
    console.log('✅ Valid:', result.valid);
    console.log('🏷️  Type:', result.type);
    console.log('📏 Content Length:', result.content?.length || 0);
    console.log('🏷️  Attributes:', result.attributes);
    
    if (result.content) {
      console.log('\n📝 Content Preview (first 200 chars):');
      console.log(result.content.substring(0, 200) + '...');
      
      // Check for expected elements
      const hasPostCards = result.content.includes('pn-post-card');
      const hasEvents = result.content.includes('Coffee Meetup') || result.content.includes('Event');
      
      console.log('\n🔍 Content Analysis:');
      console.log('📋 Contains post cards:', hasPostCards);
      console.log('📅 Contains events:', hasEvents);
      
      if (hasPostCards && hasEvents) {
        console.log('\n🎉 SUCCESS: Teleportation extracted the expected content!');
        
        // Save result to file for inspection
        const fs = require('fs').promises;
        await fs.writeFile('teleported-content.html', `
<!DOCTYPE html>
<html>
<head>
    <title>Teleported Content from Ye Olde Appe Shoppe</title>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px; 
            background: #f8fafc;
        }
        .header {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
            text-align: center;
        }
        .content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .metadata {
            background: #f3f4f6;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Teleported Content</h1>
        <p>Content extracted from Ye Olde Appe Shoppe via headless browser teleportation</p>
    </div>
    
    <div class="content">
        <div class="metadata">
            <strong>Teleportation Metadata:</strong><br>
            Type: ${result.type}<br>
            Extracted: ${result.extractedAt}<br>
            Source: ${result.metadata?.url || 'Unknown'}<br>
            Attributes: ${JSON.stringify(result.attributes, null, 2)}
        </div>
        
        <div id="teleported-content">
            ${result.content}
        </div>
    </div>
</body>
</html>
        `);
        
        console.log('💾 Saved teleported content to: teleported-content.html');
        console.log('🌐 Open it in a browser to see the extracted content!');
        
      } else {
        console.log('\n⚠️  WARNING: Content extracted but missing expected elements');
      }
    } else {
      console.log('\n❌ FAILED: No content was extracted');
    }
    
    if (result.error) {
      console.log('\n🚨 Error details:', result.error);
    }
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Step 5: Cleanup
    console.log('\n🧹 Cleaning up...');
    server.close();
    console.log('✅ Test completed');
  }
}

// Advanced test with multiple configurations
async function runAdvancedTest() {
  console.log('🧪 Advanced Teleportation Test\n');
  
  const teleporter = headlessBrowser.createTeleporter({
    maxBrowsers: 2,
    renderTimeout: 20000,
    cacheTimeout: 60000
  });
  
  try {
    await teleporter.initialize();
    console.log('🚀 Teleporter initialized');
    
    // Health check
    const health = await teleporter.healthCheck();
    console.log('💚 Health check:', health);
    
    // Test different configurations
    const testConfigs = [
      { name: 'Default', options: {} },
      { 
        name: 'High Resolution', 
        options: { 
          viewport: { width: 1920, height: 1080 },
          readyTimeout: 25000
        }
      },
      { 
        name: 'Mobile', 
        options: { 
          viewport: { width: 375, height: 667 },
          readyTimeout: 15000
        }
      }
    ];
    
    const server = require('express')().use(require('express').static(__dirname));
    const serverInstance = server.listen(8081);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    for (const config of testConfigs) {
      console.log(`\n📱 Testing ${config.name} configuration...`);
      
      const startTime = Date.now();
      const result = await teleporter.teleportFromURL(
        'http://localhost:8081/ye-olde-appe-shoppe.html',
        config.options
      );
      const duration = Date.now() - startTime;
      
      console.log(`⏱️  Duration: ${duration}ms`);
      console.log(`✅ Valid: ${result.valid}`);
      console.log(`📏 Content Length: ${result.content?.length || 0}`);
      
      if (result.metadata?.viewport) {
        console.log(`📺 Viewport: ${result.metadata.viewport.width}x${result.metadata.viewport.height}`);
      }
    }
    
    serverInstance.close();
    
  } finally {
    await teleporter.shutdown();
    console.log('✅ Advanced test completed');
  }
}

// Run tests
async function main() {
  const testType = process.argv[2] || 'basic';
  
  switch (testType) {
    case 'basic':
      await runTeleportationTest();
      break;
    case 'advanced':
      await runAdvancedTest();
      break;
    default:
      console.log('Usage: node test-teleportation.js [basic|advanced]');
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  runTeleportationTest,
  runAdvancedTest
};
