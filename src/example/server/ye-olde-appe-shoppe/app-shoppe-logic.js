// App Shoppe Logic - Main Application JavaScript
// Uses external component libraries: pn, bn, fn, hn, vs

// Default configurations based on your structure
const defaultConfigs = {
    styling: {
        "colors": {
            "primary": "#8b5cf6",
            "secondary": "#a855f7",
            "accent": "#c084fc",
            "background": "#1f2937",
            "text": "#e5e7eb",
            "textSecondary": "#9ca3af",
            "border": "#374151"
        },
        "borderRadius": "8px",
        "containerBorderRadius": "12px",
        "containerPadding": "16px",
        "sectionGap": "12px",
        "textGap": "8px",
        "imagePadding": "4px",
        "fontSizes": {
            "name": "18px",
            "description": "14px",
            "datetime": "12px",
            "address": "12px"
        },
        "fontWeights": {
            "name": "600",
            "description": "400",
            "datetime": "500",
            "address": "400"
        },
        "lineHeights": {
            "name": "24px",
            "description": "20px",
            "datetime": "16px",
            "address": "16px"
        }
    },
    settings: {
        "appName": "PostApp",
        "appDescription": "A powerful post management application",
        "appVersion": "1.0.0",
        "apiBaseUrl": "/api",
        "userUuid": "user-123",
        "debugMode": false,
        "theme": "dark",
        "locale": "en-US"
    },
    posts: {
        "defaultLayout": "mixed",
        "enableTextArea": false,
        "textAreaPlaceholder": "Share your thoughts...",
        "cardDimensions": {
            "width": "356px",
            "height": "506px"
        },
        "imageDefaults": {
            "borderRadius": "8px",
            "objectFit": "cover"
        },
        "buttons": {
            "style": "gradient",
            "availableIcons": ["calendar", "map", "star", "heart", "external", "rsvp", "clock", "location", "share"]
        },
        "animations": {
            "hoverTransform": "translateY(-2px)",
            "transition": "all 0.3s ease"
        }
    },
    forms: {
        "theme": "dark",
        "fieldTypes": {
            "text": {
                "supportedTypes": ["text", "email", "tel", "url", "password"],
                "animatedBorders": true,
                "placeholder": "Enter text..."
            },
            "textarea": {
                "charLimit": 500,
                "characterCounting": true,
                "placeholder": "Enter description..."
            },
            "image": {
                "uploadMethod": "drag-drop",
                "supportedFormats": ["JPG", "PNG", "GIF"],
                "maxFileSize": "5MB",
                "preview": true
            },
            "datetime": {
                "smartDefaults": true,
                "multipleEvents": true,
                "startEndTimes": true,
                "format": "12h"
            },
            "text-block": {
                "displayOnly": true,
                "contentProperty": "content"
            }
        },
        "validation": {
            "mode": "live",
            "showErrors": true,
            "requiredFieldMarker": "*"
        },
        "styling": {
            "borderRadius": "8px",
            "focusColor": "#8b5cf6",
            "errorColor": "#ef4444",
            "successColor": "#10b981"
        },
        "defaultFields": [
            {
                "type": "text",
                "name": "Event Name",
                "required": true,
                "placeholder": "Enter event name"
            },
            {
                "type": "textarea",
                "name": "Description",
                "charLimit": 500,
                "required": true,
                "placeholder": "Describe your event..."
            },
            {
                "type": "datetime",
                "name": "Event Schedule",
                "required": true
            },
            {
                "type": "image",
                "name": "Event Image",
                "required": false
            }
        ]
    },
    elements: {
        "navigation": {
            "type": "tabs",
            "position": "bottom",
            "style": "icons"
        },
        "animations": {
            "speed": "normal",
            "easing": "ease",
            "hoverEffects": true
        },
        "loading": {
            "type": "spinner",
            "color": "primary"
        },
        "header": {
            "style": "solid",
            "height": "64px",
            "showTitle": true
        },
        "interactions": {
            "hapticFeedback": false,
            "soundEffects": false
        }
    }
};

// Configuration templates
const templates = {
    dark: {
        "colors": {
            "primary": "#8b5cf6",
            "secondary": "#a855f7",
            "accent": "#c084fc",
            "background": "#1f2937",
            "text": "#e5e7eb",
            "textSecondary": "#9ca3af",
            "border": "#374151"
        }
    },
    light: {
      "colors": {
	"primary": "#0316FC",
	"secondary": "#FCFC03",
	"accent": "#a78bfa",
	"background": "#E1E0DD",
	"text": "#1f2937",
	"textSecondary": "#6b7280",
	"border": "#7C7C7C"
      },
      "borderRadius": "0px",
      "containerBorderRadius": "0px",
      "containerPadding": "16px",
      "sectionGap": "12px",
      "textGap": "8px",
      "imagePadding": "8px",
      "fontSizes": {
	"name": "18px",
	"description": "14px",
	"datetime": "12px",
	"address": "12px"
      },
      "fontWeights": {
	"name": "600",
	"description": "400",
	"datetime": "500",
	"address": "400"
      },
      "lineHeights": {
	"name": "24px",
	"description": "20px",
	"datetime": "16px",
	"address": "16px"
      }
    },
    colorful: {
        "colors": {
            "primary": "#ec4899",
            "secondary": "#10b981",
            "accent": "#f59e0b",
            "background": "#1e1b4b",
            "text": "#fbbf24",
            "textSecondary": "#a78bfa",
            "border": "#7c3aed"
        }
    },
    minimal: {
        "colors": {
            "primary": "#6b7280",
            "secondary": "#9ca3af",
            "accent": "#d1d5db",
            "background": "#f9fafb",
            "text": "#111827",
            "textSecondary": "#6b7280",
            "border": "#e5e7eb"
        }
    }
};

// Current config state
let currentConfigs = { ...defaultConfigs };

// Tab switching
document.querySelectorAll('.config-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const tabName = this.dataset.tab;
        
        // Update tab states
        document.querySelectorAll('.config-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Update section visibility
        document.querySelectorAll('.config-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(tabName + '-section').classList.add('active');
    });
});

// JSON validation
function validateJSON(text, configType) {
    const validationElement = document.getElementById(configType + 'Validation');
    
    try {
        const parsed = JSON.parse(text);
        validationElement.className = 'json-validation valid';
        validationElement.textContent = '✅ Valid JSON configuration';
        return { valid: true, data: parsed };
    } catch (error) {
        validationElement.className = 'json-validation invalid';
        validationElement.textContent = `❌ JSON Error: ${error.message}`;
        return { valid: false, error: error.message };
    }
}

// Format JSON
function formatJSON(editorId) {
    const editor = document.getElementById(editorId);
    try {
        const parsed = JSON.parse(editor.value);
        editor.value = JSON.stringify(parsed, null, 2);
        
        // Get config type from editor id
        const configType = editorId.replace('Config', '');
        validateJSON(editor.value, configType);
    } catch (error) {
        console.error('Invalid JSON, cannot format');
    }
}

// Load template
function loadTemplate(templateName) {
    const template = templates[templateName];
    if (template) {
        // Merge with current styling config
        const currentStyling = { ...currentConfigs.styling, ...template };
        document.getElementById('stylingConfig').value = JSON.stringify(currentStyling, null, 2);
        validateJSON(document.getElementById('stylingConfig').value, 'styling');
        updatePreview();
    }
}

// Reset configuration
function resetConfig(configType) {
    if (confirm(`Art thou sure thou wishest to reset the ${configType} configuration to defaults?`)) {
        const editor = document.getElementById(configType + 'Config');
        editor.value = JSON.stringify(defaultConfigs[configType], null, 2);
        validateJSON(editor.value, configType);
        updatePreview();
    }
}

function saveAllConfigs() {
    // Check if allyabase object exists
    if (typeof allyabase === 'undefined' || !allyabase) {
        alert('❌ Error: allyabase object not found. Cannot save configurations.');
        return;
    }
    
    // Check if saveBDO method exists
    if (typeof allyabase.saveBDO !== 'function') {
        alert('❌ Error: allyabase.saveBDO method not found. Cannot save configurations.');
        return;
    }
    
    // Collect all configurations
    const allConfigs = {
        styling: currentConfigs.styling,
        settings: currentConfigs.settings,
        posts: currentConfigs.posts,
        forms: currentConfigs.forms,
        elements: currentConfigs.elements,
        savedAt: new Date().toISOString(),
        version: "1.0.0",
        appType: "ye-olde-appe-shoppe-config"
    };
    
    try {
        // Call the allyabase saveBDO method
        const result = allyabase.saveBDO(allConfigs);
        
        // Handle the result (assuming it might be a promise or return a value)
        if (result && typeof result.then === 'function') {
            // It's a promise
            result.then(function(response) {
                alert('✅ Configurations saved successfully to allyabase!');
                console.log('Save successful:', response);
            }).catch(function(error) {
                alert('❌ Error saving configurations: ' + (error.message || error));
                console.error('Save error:', error);
            });
        } else {
            // Synchronous result
            alert('✅ Configurations saved successfully to allyabase!');
            console.log('Save successful:', result);
        }
        
    } catch (error) {
        alert('❌ Error calling allyabase.saveBDO: ' + (error.message || error));
        console.error('Save error:', error);
    }
}


// Update preview
function updatePreview() {
    // Collect all configurations
    const configs = {};
    
    ['styling', 'settings', 'posts', 'forms', 'elements'].forEach(configType => {
        const editorValue = document.getElementById(configType + 'Config').value;
        const validation = validateJSON(editorValue, configType);
        
        if (validation.valid) {
            configs[configType] = validation.data;
        } else {
            configs[configType] = defaultConfigs[configType];
        }
    });

    currentConfigs = configs;
    
    // Generate preview HTML using external components
    const previewHTML = generatePreviewHTML(configs);
    document.getElementById('previewFrame').srcdoc = previewHTML;
}

// Fixed generatePreviewHTML function with proper config passing
function generatePreviewHTML(configs) {
    const styling = configs.styling;
    const settings = configs.settings;
    const posts = configs.posts;
    const forms = configs.forms;
    const elements = configs.elements;

    // Helper function to determine if a color is light or dark
    function isLightColor(color) {
        if (!color) return true;
        const hex = color.replace('#', '');
        if (hex.length === 6) {
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128;
        }
        return true;
    }

    // Determine contrast colors based on background
    const isLightBg = isLightColor(styling.colors.background);
    const headerFooterBg = styling.colors.background || '#ffffff';
    const headerFooterText = isLightBg ? '#1f2937' : '#ffffff';
    const contentBg = styling.colors.background || '#f5f5f5';
    const cardBg = isLightBg ? '#ffffff' : (styling.colors.border || '#374151');
    const cardBorder = styling.colors.border || (isLightBg ? '#e5e7eb' : '#4b5563');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${settings.appName} Preview</title>
    
    <style>
        html {
            background: transparent;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: transparent;
            height: 100vh;
            overflow: hidden;
        }

        .app-container {
            display: flex;
            flex-direction: column;
            height: 100vh;
            max-width: 400px;
            margin: 0 auto;
            border: 1px solid ${cardBorder};
            background: transparent;
        }

        .app-header {
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .app-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: ${contentBg};
        }

        .app-footer {
            position: sticky;
            bottom: 0;
            z-index: 100;
            box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
        }

        /* Screen Management */
        .screen {
            display: none;
            height: 100%;
        }

        .screen.active {
            display: flex;
            flex-direction: column;
        }

        /* Screen specific styles */
        .home-content, .add-post-content, .manage-posts-content {
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 100%;
        }

        .post-feed {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .more-content {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: ${styling.colors.text || '#ffffff'};
            font-size: 1.5rem;
            font-weight: bold;
        }

        .form-container {
            background: ${cardBg};
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            border: 1px solid ${cardBorder};
        }

        .post-with-actions {
            position: relative;
        }

        .post-actions {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid ${cardBorder};
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 200px;
            color: ${styling.colors.textSecondary || '#6b7280'};
            text-align: center;
        }

        .empty-state h3 {
            margin-bottom: 10px;
            font-size: 1.2rem;
        }

        /* Component base styles */
        .pn-post-card {
            width: 100% !important;
            max-width: 340px;
            margin: 0 auto;
            height: auto !important;
            min-height: 300px;
        }

        /* Scrollbar styling for post content */
        .pn-post-card *::-webkit-scrollbar {
            height: 4px;
            width: 4px;
        }

        .pn-post-card *::-webkit-scrollbar-track {
            background: transparent;
        }

        .pn-post-card *::-webkit-scrollbar-thumb {
            background: ${cardBorder};
            border-radius: 2px;
        }

        .pn-post-card *::-webkit-scrollbar-thumb:hover {
            background: ${styling.colors.accent || '#c084fc'};
        }

        /* DateTime horizontal scrolling */
        .pn-post-card .datetime-scroll {
            scrollbar-width: thin;
            scrollbar-color: ${cardBorder} transparent;
        }

        .pn-post-card .datetime-scroll::-webkit-scrollbar {
            height: 3px;
        }

        .pn-post-card .datetime-scroll::-webkit-scrollbar-track {
            background: transparent;
        }

        .pn-post-card .datetime-scroll::-webkit-scrollbar-thumb {
            background: ${styling.colors.accent || '#c084fc'};
            border-radius: 2px;
        }

        /* Image hover effects */
        .pn-post-card img {
            transition: transform 0.3s ease;
        }

        .pn-post-card img:hover {
            transform: scale(1.02);
        }

        /* Button hover effects */
        .pn-post-card button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .bn-button-container {
            margin-bottom: 20px;
        }

        .hn-header-footer {
            background: ${headerFooterBg} !important;
            color: ${headerFooterText} !important;
        }

        .hn-title {
            color: ${headerFooterText} !important;
            font-size: 1.2rem !important;
            font-weight: 700 !important;
        }

        /* Apply comprehensive color scheme */
        :root {
            --app-primary-color: ${styling.colors.primary || '#8b5cf6'};
            --app-secondary-color: ${styling.colors.secondary || '#a855f7'};
            --app-accent-color: ${styling.colors.accent || '#c084fc'};
            --app-bg-color: ${styling.colors.background || '#1f2937'};
            --app-text-color: ${styling.colors.text || '#e5e7eb'};
            --app-text-secondary: ${styling.colors.textSecondary || '#9ca3af'};
            --app-border-color: ${styling.colors.border || '#374151'};
        }
    </style>
</head>
<body>
    <div class="app-container">
        <!-- Screen 1: Home/Main -->
        <div id="home-screen" class="screen active">
            <div class="app-header" id="home-header"></div>
            <div class="app-content">
                <div class="home-content">
                    <div id="home-button-container"></div>
                    <teleport data-app="ye-olde-appe-shoppe" data-theme="dark">
                        <div class="post-feed" id="home-post-feed"></div>
                    </teleport>
                </div>
            </div>
            <div class="app-footer" id="home-footer"></div>
        </div>

        <!-- Screen 2: Add/Edit Post -->
        <div id="add-post-screen" class="screen">
            <div class="app-header" id="add-post-header"></div>
            <div class="app-content">
                <div class="add-post-content">
                    <div class="form-container" id="form-container"></div>
                </div>
            </div>
        </div>

        <!-- Screen 3: Manage Posts -->
        <div id="manage-posts-screen" class="screen">
            <div class="app-header" id="manage-posts-header"></div>
            <div class="app-content">
                <div class="manage-posts-content">
                    <div class="post-feed" id="manage-post-feed"></div>
                </div>
            </div>
            <div class="app-footer" id="manage-footer"></div>
        </div>

        <!-- Screen 4: More -->
        <div id="more-screen" class="screen">
            <div class="app-header" id="more-header"></div>
            <div class="app-content" style="background: ${styling.colors.primary || '#8b5cf6'};">
                <div class="more-content">
                    <div>More Screen - ${settings.appName}</div>
                </div>
            </div>
            <div class="app-footer" id="more-footer"></div>
        </div>
    </div>

    <script>
        // Create component configurations based on user settings
        const componentConfigs = {
            // Post component config - mapped from styling config
            postConfig: {
                colors: {
                    background: '${cardBg}',
                    text: {
                        primary: '${styling.colors.text || '#1a1a1a'}',
                        secondary: '${styling.colors.textSecondary || '#666666'}',
                        accent: '${styling.colors.accent || '#2563eb'}'
                    },
                    border: '${cardBorder}',
                    shadow: 'rgba(0, 0, 0, 0.1)'
                },
                typography: {
                    name: {
                        fontSize: '${styling.fontSizes?.name || '18px'}',
                        fontWeight: '${styling.fontWeights?.name || '600'}',
                        lineHeight: '${styling.lineHeights?.name || '24px'}'
                    },
                    description: {
                        fontSize: '${styling.fontSizes?.description || '14px'}',
                        fontWeight: '${styling.fontWeights?.description || '400'}',
                        lineHeight: '${styling.lineHeights?.description || '20px'}'
                    },
                    dateTime: {
                        fontSize: '${styling.fontSizes?.datetime || '14px'}',
                        fontWeight: '${styling.fontWeights?.datetime || '500'}',
                        lineHeight: '${styling.lineHeights?.datetime || '18px'}'
                    },
                    address: {
                        fontSize: '${styling.fontSizes?.address || '12px'}',
                        fontWeight: '${styling.fontWeights?.address || '400'}',
                        lineHeight: '${styling.lineHeights?.address || '16px'}'
                    }
                },
                spacing: {
                    containerPadding: '${styling.containerPadding || '16px'}',
                    sectionGap: '${styling.sectionGap || '12px'}',
                    textGap: '${styling.textGap || '8px'}',
                    imagePadding: '${styling.imagePadding || '4px'}',
                    imageBorderRadius: '${styling.borderRadius || '8px'}',
                    containerBorderRadius: '${styling.containerBorderRadius || '12px'}'
                }
            },

            // Button container config
            buttonConfig: {
                layout: 'horizontal',
                alignment: 'center',
                spacing: 'normal',
                theme: '${settings.theme || 'light'}',
                colors: {
                    primary: '${styling.colors.primary || '#3b82f6'}',
                    secondary: '${styling.colors.secondary || '#64748b'}',
                    success: '${styling.colors.accent || '#10b981'}',
                    warning: '#f59e0b',
                    danger: '#ef4444'
                },
                sizing: {
                    containerPadding: '${styling.containerPadding || '16px'}',
                    buttonGap: '${styling.sectionGap || '12px'}'
                }
            },

            // Form widget config
            formConfig: {
                theme: '${settings.theme || 'dark'}',
                colors: {
                    primary: '${styling.colors.primary || '#8b5cf6'}',
                    secondary: '${styling.colors.secondary || '#10b981'}',
                    danger: '#ef4444',
                    warning: '#f59e0b',
                    success: '${styling.colors.accent || '#10b981'}'
                },
                spacing: {
                    fieldMargin: '20px',
                    padding: '${styling.containerPadding || '20px'}',
                    borderRadius: '${styling.borderRadius || '8px'}'
                }
            },

            // Header/Footer config
            headerFooterTheme: {
                colors: {
                    gray: '${styling.colors.textSecondary || '#6b7280'}',
                    primary: '${styling.colors.primary || '#3b82f6'}',
                    background: '${headerFooterBg}',
                    foreground: '${headerFooterText}'
                },
                spacing: {
                    padding: '${styling.containerPadding || '16px'}',
                    gap: '${styling.sectionGap || '12px'}'
                },
                typography: {
                    fontSize: '${styling.fontSizes?.name || '18px'}',
                    fontWeight: '${styling.fontWeights?.name || 'bold'}',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }
            }
        };

        // Post component callbacks
        const postCallbacks = {
            onPostClick: function(post) {
                console.log('Post clicked:', post.name);
            },
            onNameClick: function(post) {
                console.log('Name clicked:', post.name);
            },
            onDateTimeClick: function(dateTime, post) {
                console.log('DateTime clicked for:', post.name);
            },
            onAddressClick: function(post) {
                console.log('Address clicked:', post.address);
            },
            onShareClick: function(post) {
                console.log('Share clicked for:', post.name);
            },
            onButtonClick: function(buttonId, buttonText, post) {
                console.log('Button clicked:', buttonText, 'for', post.name);
            }
        };

        // Fake the external component libraries for preview with proper config support
        const PnPostComponent = {
            initPosts: function(containerId, posts, config, callbacks) {
                const container = document.getElementById(containerId);
                if (!container) {
                    console.error('Container not found:', containerId);
                    return;
                }
                
                // Use provided config or fall back to component config
                const finalConfig = config || componentConfigs.postConfig;
                const finalCallbacks = callbacks || postCallbacks;
                
                container.innerHTML = '';
                
                if (posts && posts.length > 0) {
                    posts.forEach(post => {
                        const postElement = this.createPost(post, finalConfig);
                        container.appendChild(postElement);
                    });
                } else {
                    container.innerHTML = \`
                        <div class="empty-state">
                            <h3>No posts found</h3>
                            <p>Create your first post to get started!</p>
                        </div>
                    \`;
                }
            },

            createPost: function(postData, config) {
                const card = document.createElement('div');
                card.className = 'pn-post-card';
                
                // Apply configuration styles
                const bgColor = config?.colors?.background || '${cardBg}';
                const textColor = config?.colors?.text?.primary || '${styling.colors.text || '#1a1a1a'}';
                const textSecondary = config?.colors?.text?.secondary || '${styling.colors.textSecondary || '#666666'}';
                const accentColor = config?.colors?.text?.accent || '${styling.colors.accent || '#2563eb'}';
                const borderRadius = config?.spacing?.containerBorderRadius || '${styling.containerBorderRadius || '12px'}';
                const containerPadding = config?.spacing?.containerPadding || '${styling.containerPadding || '16px'}';
                const sectionGap = config?.spacing?.sectionGap || '${styling.sectionGap || '12px'}';
                const textGap = config?.spacing?.textGap || '${styling.textGap || '8px'}';
                const imageBorderRadius = config?.spacing?.imageBorderRadius || '${styling.borderRadius || '8px'}';
                
                card.style.cssText = \`
                    width: 100% !important;
                    max-width: 340px;
                    margin: 0 auto 20px auto;
                    background: \${bgColor};
                    border-radius: \${borderRadius};
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    border: 1px solid ${cardBorder};
                    overflow: hidden;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    height: ${posts.cardDimensions?.height || '506px'};
                    width: ${posts.cardDimensions?.width || '356px'};
                \`;
                
                // Format datetime with separate day/date and time parts
                function formatDateTime(startDateTime, endDateTime) {
                    const start = new Date(startDateTime);
                    const end = new Date(endDateTime);
                    
                    const dayOfWeek = start.toLocaleDateString('en-US', { weekday: 'long' });
                    const dateString = start.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
                    
                    const formatTime = (date) => {
                        return date.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                        });
                    };
                    
                    const startTime = formatTime(start);
                    const endTime = formatTime(end);
                    
                    return {
                        dayDate: \`\${dayOfWeek}, \${dateString}\`,
                        timeRange: \`\${startTime} - \${endTime}\`
                    };
                }
                
                // Generate datetime HTML with horizontal scrolling
                let dateTimeHtml = '';
                if (postData.dateTimes && postData.dateTimes.length > 0) {
                    const dateTimeItems = postData.dateTimes.map((dateTime, index) => {
                        const formatted = formatDateTime(dateTime.startDateTime, dateTime.endDateTime);
                        return \`
                            <div style="flex-shrink: 0; margin-right: \${index < postData.dateTimes.length - 1 ? '16px' : '0'}; min-width: 140px;">
                                <div style="color: \${accentColor}; font-size: \${config?.typography?.dateTime?.fontSize || '14px'}; font-weight: \${config?.typography?.dateTime?.fontWeight || '500'}; text-decoration: underline; margin-bottom: 2px;">
                                    \${formatted.dayDate}
                                </div>
                                <div style="color: \${textSecondary}; font-size: \${config?.typography?.dateTime?.fontSize || '14px'}; font-weight: \${config?.typography?.dateTime?.fontWeight || '500'};">
                                    \${formatted.timeRange}
                                </div>
                            </div>
                        \`;
                    }).join('');
                    
                    dateTimeHtml = \`
                        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: \${textGap};">
                            <span style="font-size: 14px; flex-shrink: 0;">🕐</span>
                            <div class="datetime-scroll" style="display: flex; overflow-x: auto; scrollbar-width: thin; scrollbar-color: ${cardBorder} transparent; gap: 0;">
                                \${dateTimeItems}
                            </div>
                        </div>
                    \`;
                }
                
                // Determine layout and create content
                const isImageOnly = postData.layout === 'image-only';
                const isMixed = postData.layout === 'mixed';
                
                let topSectionContent = '';
                let descriptionSection = '';
                
                if (isImageOnly) {
                    // Image-only layout - full width image
                    topSectionContent = \`
                        <div style="width: 100%; height: 200px; background: #f0f0f0; border-radius: \${imageBorderRadius}; overflow: hidden; margin-bottom: \${sectionGap};">
                            <img src="\${postData.imageUri}" alt="Post image" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; opacity: 0;" onload="this.style.opacity='1'" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=&quot;display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 14px;&quot;>📸 Image Loading...</div>'">
                        </div>
                    \`;
                    
                    // Description goes below image in image-only layout
                    descriptionSection = \`
                        <div style="color: \${textSecondary}; font-size: \${config?.typography?.description?.fontSize || '14px'}; line-height: \${config?.typography?.description?.lineHeight || '20px'}; margin-bottom: \${sectionGap}; white-space: pre-wrap; word-wrap: break-word;">
                            \${postData.description}
                        </div>
                    \`;
                } else if (isMixed) {
                    // Mixed layout - horizontal scrolling with image and description side-by-side
                    topSectionContent = \`
                        <div style="display: flex; gap: \${sectionGap}; height: 268px; overflow-x: auto; scrollbar-width: thin; scrollbar-color: ${cardBorder} transparent; margin-bottom: \${sectionGap};">
                            <div style="width: 268px; height: 268px; background: #f0f0f0; border-radius: \${imageBorderRadius}; overflow: hidden; flex-shrink: 0; position: relative;">
                                <img src="\${postData.imageUri}" alt="Post image" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; opacity: 0;" onload="this.style.opacity='1'" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=&quot;display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 14px;&quot;>📸 Image Loading...</div>'">
                            </div>
                            <div style="flex: 1; display: flex; flex-direction: column; min-width: 300px; width: 300px;">
                                <div style="color: \${textSecondary}; font-size: \${config?.typography?.description?.fontSize || '14px'}; line-height: \${config?.typography?.description?.lineHeight || '20px'}; flex: 1; overflow-y: auto; margin-bottom: \${textGap}; scrollbar-width: thin; scrollbar-color: ${cardBorder} transparent; white-space: pre-wrap; word-wrap: break-word;">
                                    \${postData.description}
                                </div>
                            </div>
                        </div>
                    \`;
                } else {
                    // Default layout - just description
                    descriptionSection = \`
                        <div style="color: \${textSecondary}; font-size: \${config?.typography?.description?.fontSize || '14px'}; line-height: \${config?.typography?.description?.lineHeight || '20px'}; margin-bottom: \${sectionGap}; white-space: pre-wrap; word-wrap: break-word;">
                            \${postData.description}
                        </div>
                    \`;
                }
                
                card.innerHTML = \`
                    <div style="padding: \${containerPadding}; display: flex; flex-direction: column; height: 100%; gap: \${sectionGap};">
                        \${topSectionContent}
                        \${descriptionSection}
                        <div style="font-size: \${config?.typography?.name?.fontSize || '18px'}; font-weight: \${config?.typography?.name?.fontWeight || '600'}; color: \${textColor}; margin-bottom: \${textGap}; cursor: pointer; transition: color 0.2s ease;">
                            \${postData.name}
                        </div>
                        <div style="margin-bottom: \${textGap};">
                            \${dateTimeHtml}
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 4px; margin-bottom: \${sectionGap};">
                            <span style="font-size: 12px; margin-top: 2px; flex-shrink: 0;">📍</span>
                            <div style="flex: 1;">
                                <div style="color: \${textSecondary}; font-size: \${config?.typography?.address?.fontSize || '12px'}; font-weight: \${config?.typography?.address?.fontWeight || '400'}; margin-bottom: 2px;">
                                    \${postData.address.line1}
                                </div>
                                <div style="color: \${textSecondary}; font-size: \${config?.typography?.address?.fontSize || '12px'}; font-weight: \${config?.typography?.address?.fontWeight || '400'}; text-decoration: underline;">
                                    \${postData.address.line2}
                                </div>
                            </div>
                        </div>
                        <div style="margin-top: auto; padding-top: \${textGap}; border-top: 1px solid ${cardBorder}; display: flex; justify-content: space-between; align-items: flex-end;">
                            <div style="flex: 1;"></div>
                            <button style="background: \${accentColor}; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; color: white; margin-left: 8px; flex-shrink: 0;">
                                <span style="font-size: 16px;">📤</span>
                            </button>
                        </div>
                        <button style="width: 100%; padding: 12px; background: ${posts.buttons?.style === 'gradient' ? `linear-gradient(135deg, ${styling.colors.primary || '#8b5cf6'}, ${styling.colors.secondary || '#a855f7'})` : (styling.colors.primary || '#8b5cf6')}; color: white; border: none; border-radius: \${imageBorderRadius}; font-weight: 600; cursor: pointer; transition: all 0.3s ease; margin-top: \${textGap};">
                            \${postData.buttonText}
                        </button>
                    </div>
                \`;
                
                // Add hover effects
                card.onmouseenter = function() {
                    this.style.transform = 'translateY(-4px)';
                    this.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                };
                card.onmouseleave = function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                };
                
                return card;
            }
        };

        const BnButtonContainer = {
            init: function(containerId, buttons, config, options) {
                const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
                if (!container) {
                    console.error('Button container not found:', containerId);
                    return;
                }
                
                // Use provided config or fall back to component config
                const finalConfig = config || componentConfigs.buttonConfig;
                
                container.innerHTML = '';
                
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = \`
                    display: flex; 
                    gap: \${finalConfig.sizing?.buttonGap || '12px'}; 
                    margin-bottom: 20px;
                    justify-content: \${finalConfig.alignment === 'center' ? 'center' : finalConfig.alignment};
                    flex-direction: \${finalConfig.layout === 'vertical' ? 'column' : 'row'};
                \`;
                
                buttons.forEach(btn => {
                    const button = document.createElement('button');
                    button.textContent = btn.text;
                    button.style.cssText = \`
                        flex: 1; 
                        padding: 14px 20px; 
                        background: \${finalConfig.colors?.primary || '${styling.colors.primary || '#8b5cf6'}'}; 
                        color: white; 
                        border: none; 
                        border-radius: \${finalConfig.spacing?.borderRadius || '8px'}; 
                        font-weight: 600; 
                        cursor: pointer;
                        transition: all 0.3s ease;
                    \`;
                    button.onclick = btn.onClick || function() {};
                    buttonContainer.appendChild(button);
                });
                
                container.appendChild(buttonContainer);
            }
        };

        const FnFormWidget = {
            initForm: function(containerId, fields, config, options) {
                const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
                if (!container) {
                    console.error('Form container not found:', containerId);
                    return;
                }
                
                // Use provided config or fall back to component config
                const finalConfig = config || componentConfigs.formConfig;
                
                const textColor = finalConfig.colors?.primary || '${styling.colors.text || '#ffffff'}';
                const inputBg = '${isLightBg ? '#f9fafb' : '#111827'}';
                const inputBorder = '${cardBorder}';
                const borderRadius = finalConfig.spacing?.borderRadius || '8px';
                
                container.innerHTML = \`
                    <div style="margin-bottom: 15px; padding: \${finalConfig.spacing?.padding || '15px'}; background: ${isLightBg ? '#f3f4f6' : '#4b5563'}; border-radius: \${borderRadius}; color: \${textColor};">
                        Create a new post with the details below.
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: bold; color: \${textColor};">Event Name *</label>
                        <input type="text" placeholder="Enter event name" style="width: 100%; padding: 12px; border: 2px solid \${inputBorder}; border-radius: \${borderRadius}; background: \${inputBg}; color: \${textColor};">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: bold; color: \${textColor};">Description (${forms.fieldTypes?.textarea?.charLimit || 500} chars)</label>
                        <textarea placeholder="Describe your event..." style="width: 100%; height: 80px; padding: 12px; border: 2px solid \${inputBorder}; border-radius: \${borderRadius}; background: \${inputBg}; color: \${textColor}; resize: vertical;"></textarea>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: bold; color: \${textColor};">Event Schedule</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <input type="datetime-local" style="padding: 8px; border: 2px solid \${inputBorder}; border-radius: \${borderRadius}; background: \${inputBg}; color: \${textColor};">
                            <input type="datetime-local" style="padding: 8px; border: 2px solid \${inputBorder}; border-radius: \${borderRadius}; background: \${inputBg}; color: \${textColor};">
                        </div>
                    </div>
                    <div style="border: 2px dashed \${inputBorder}; border-radius: \${borderRadius}; padding: 20px; text-align: center; background: ${isLightBg ? '#f9fafb' : '#374151'}; color: ${styling.colors.textSecondary || '#9ca3af'};">
                        📸 Click to upload an image
                    </div>
                \`;
            }
        };

        const HnHeaderFooter = {
            init: function(containerId, props, theme) {
                const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
                if (!container) {
                    console.error('Header/Footer container not found:', containerId);
                    return;
                }
                
                // Use provided theme or fall back to component theme
                const finalTheme = theme || componentConfigs.headerFooterTheme;
                
                container.innerHTML = '';
                
                const header = document.createElement('div');
                header.className = 'hn-header-footer';
                header.style.cssText = \`
                    display: flex; 
                    align-items: center; 
                    justify-content: space-between;
                    height: \${props.height || 64}px; 
                    padding: 0 \${finalTheme.spacing?.padding || '16px'};
                    background: \${props.backgroundColor || finalTheme.colors?.background || '${headerFooterBg}'};
                    color: \${props.foregroundColor || finalTheme.colors?.foreground || '${headerFooterText}'};
                    border-\${props.position === 'footer' ? 'top' : 'bottom'}: 1px solid ${cardBorder};
                \`;
                
                if (props.headerTitle) {
                    // Header with title
                    const titleDiv = document.createElement('div');
                    titleDiv.style.cssText = \`
                        flex: 1; 
                        text-align: center; 
                        font-size: \${finalTheme.typography?.fontSize || '1.2rem'}; 
                        font-weight: \${finalTheme.typography?.fontWeight || '700'};
                        font-family: \${finalTheme.typography?.fontFamily || 'inherit'};
                    \`;
                    titleDiv.textContent = props.headerTitle;
                    header.appendChild(titleDiv);
                    
                    if (props.navigationItems && props.navigationItems.length > 0) {
                        const navContainer = document.createElement('div');
                        navContainer.style.cssText = 'position: absolute; right: 16px; display: flex; gap: 12px;';
                        
                        props.navigationItems.forEach((item, index) => {
                            const navButton = document.createElement('div');
                            navButton.style.cssText = 'width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 8px; transition: all 0.2s;';
                            navButton.textContent = '⚙️';
                            navButton.onclick = item[1];
                            navContainer.appendChild(navButton);
                        });
                        
                        header.appendChild(navContainer);
                    }
                } else {
                    // Footer navigation
                    const navContainer = document.createElement('div');
                    navContainer.style.cssText = 'display: flex; justify-content: space-evenly; width: 100%;';
                    
                    (props.navigationItems || []).forEach((item, index) => {
                        const navItem = document.createElement('div');
                        navItem.style.cssText = 'display: flex; flex-direction: column; align-items: center; cursor: pointer; padding: 8px; transition: all 0.2s;';
                        
                        const icon = document.createElement('div');
                        icon.style.cssText = 'width: 24px; height: 24px; margin-bottom: 4px; font-size: 18px;';
                        icon.textContent = index === 0 ? '🏠' : '⚙️';
                        
                        const label = document.createElement('span');
                        label.style.cssText = 'font-size: 11px;';
                        label.textContent = item[2] || 'Tab';
                        
                        navItem.appendChild(icon);
                        navItem.appendChild(label);
                        navItem.onclick = item[1];
                        
                        navContainer.appendChild(navItem);
                    });
                    
                    header.appendChild(navContainer);
                }
                
                container.appendChild(header);
            }
        };

        // App state and sample data with actual images and proper layout info
        let appState = {
            currentScreen: 'home',
            posts: [
                {
                    id: 'post-1',
                    name: 'Coffee Meetup',
                    layout: '${posts.defaultLayout || 'mixed'}',
                    description: 'Join us for coffee and networking! This preview shows how thy posts will appear with current configurations. Perfect for testing typography and spacing. The mixed layout allows you to see both images and descriptions side-by-side with horizontal scrolling.',
                    address: { line1: 'Blue Bottle Coffee', line2: '123 Main St, Portland, OR' },
                    buttonText: '${posts.buttons?.style?.toUpperCase() || 'GRADIENT'} Button',
                    imageUri: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
                    dateTimes: [
                        {
                            startDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).getTime(),
                            endDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).getTime()
                        }
                    ]
                },
                {
                    id: 'post-2', 
                    name: 'Art Gallery Opening',
                    layout: 'image-only',
                    description: 'Contemporary art exhibition featuring local artists. Experience the mystical configurations in action with beautiful layouts. Image-only layout puts focus on the visual content.',
                    address: { line1: 'Downtown Gallery', line2: '456 Art Street, Portland, OR' },
                    buttonText: 'Buy Tickets',
                    imageUri: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=200&fit=crop',
                    dateTimes: [
                        {
                            startDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).getTime(),
                            endDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).getTime()
                        }
                    ]
                },
                {
                    id: 'post-3',
                    name: 'Tech Meetup: ${settings.appName}',
                    layout: 'mixed',
                    description: 'Learn about app development and JSON configurations. See how thy chosen colors and fonts work in practice! This mixed layout demonstrates the horizontal scrolling functionality with both image and text content visible simultaneously.',
                    address: { line1: 'Tech Hub', line2: '789 Innovation Dr, Portland, OR' },
                    buttonText: 'RSVP Now',
                    imageUri: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop',
                    dateTimes: [
                        {
                            startDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).getTime(),
                            endDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).getTime()
                        }
                    ]
                },
                {
                    id: 'post-4',
                    name: 'Weekend Workshop',
                    layout: '${posts.defaultLayout || 'mixed'}',
                    description: 'Hands-on workshop demonstrating component systems. Theme: ${settings.theme} • Primary: ${styling.colors.primary}. This preview shows real component behavior with actual images and scrolling.',
                    address: { line1: 'Learning Center', line2: '321 Workshop Ave, Portland, OR' },
                    buttonText: 'Join Workshop',
                    imageUri: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=300&fit=crop',
                    dateTimes: [
                        {
                            startDateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).getTime(),
                            endDateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).getTime()
                        }
                    ]
                }
            ]
        };

        // Navigation system
        function navigateToScreen(screenName) {
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            const targetScreen = document.getElementById(screenName + '-screen');
            if (targetScreen) {
                targetScreen.classList.add('active');
                appState.currentScreen = screenName;
                
                switch(screenName) {
                    case 'home':
                        refreshHomeScreen();
                        break;
                    case 'add-post':
                        setupAddPostScreen();
                        break;
                    case 'manage-posts':
                        refreshManagePostsScreen();
                        break;
                    case 'more':
                        setupMoreScreen();
                        break;
                }
            }
        }

        function setupHomeScreen() {
            // Pass theme to header/footer
            HnHeaderFooter.init('home-header', {
                headerTitle: '${settings.appName}',
                navigationItems: [['', () => navigateToScreen('add-post'), 'Add Post']],
                backgroundColor: '${headerFooterBg}',
                foregroundColor: '${headerFooterText}',
                height: 64
            }, componentConfigs.headerFooterTheme);

            // Pass config to button container
            BnButtonContainer.init('home-button-container', [
                {
                    text: 'Create Event',
                    onClick: () => navigateToScreen('add-post')
                }
            ], componentConfigs.buttonConfig);

            HnHeaderFooter.init('home-footer', {
                navigationItems: [
                    ['', () => navigateToScreen('home'), 'Home'],
                    ['', () => navigateToScreen('more'), 'More']
                ],
                backgroundColor: '${headerFooterBg}',
                foregroundColor: '${headerFooterText}',
                height: 70,
                position: 'footer'
            }, componentConfigs.headerFooterTheme);

            refreshHomeScreen();
        }

        function refreshHomeScreen() {
            // Pass config and callbacks to posts
            PnPostComponent.initPosts('home-post-feed', appState.posts, componentConfigs.postConfig, postCallbacks);
        }

        function setupAddPostScreen() {
            HnHeaderFooter.init('add-post-header', {
                headerTitle: 'Add a Post',
                navigationItems: [['', () => navigateToScreen('home'), 'Close']],
                backgroundColor: '${headerFooterBg}',
                foregroundColor: '${headerFooterText}',
                height: 64
            }, componentConfigs.headerFooterTheme);

            // Pass config to form
            FnFormWidget.initForm('form-container', [], componentConfigs.formConfig);
        }

        function refreshManagePostsScreen() {
            HnHeaderFooter.init('manage-posts-header', {
                headerTitle: 'Manage Posts',
                navigationItems: [['', () => navigateToScreen('home'), 'Back']],
                backgroundColor: '${headerFooterBg}',
                foregroundColor: '${headerFooterText}',
                height: 64
            }, componentConfigs.headerFooterTheme);

            HnHeaderFooter.init('manage-footer', {
                navigationItems: [
                    ['', () => navigateToScreen('home'), 'Home'],
                    ['', () => navigateToScreen('more'), 'More']
                ],
                backgroundColor: '${headerFooterBg}',
                foregroundColor: '${headerFooterText}',
                height: 70,
                position: 'footer'
            }, componentConfigs.headerFooterTheme);

            const container = document.getElementById('manage-post-feed');
            container.innerHTML = '';
            
            appState.posts.forEach(post => {
                const postContainer = document.createElement('div');
                postContainer.className = 'post-with-actions';
                postContainer.style.marginBottom = '20px';
                
                // Pass config to individual post creation
                const postElement = PnPostComponent.createPost(post, componentConfigs.postConfig);
                postContainer.appendChild(postElement);
                
                const actionsContainer = document.createElement('div');
                actionsContainer.className = 'post-actions';
                actionsContainer.innerHTML = \`
                    <div style="display: flex; gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid ${cardBorder};">
                        <button style="flex: 1; padding: 10px; background: transparent; border: 2px solid ${styling.colors.primary || '#8b5cf6'}; color: ${styling.colors.primary || '#8b5cf6'}; border-radius: ${styling.borderRadius || '8px'}; cursor: pointer; font-weight: 600;">Edit</button>
                        <button style="flex: 1; padding: 10px; background: #ef4444; border: 2px solid #ef4444; color: white; border-radius: ${styling.borderRadius || '8px'}; cursor: pointer; font-weight: 600;">Delete</button>
                    </div>
                \`;
                
                postContainer.appendChild(actionsContainer);
                container.appendChild(postContainer);
            });
        }

        function setupMoreScreen() {
            HnHeaderFooter.init('more-header', {
                headerTitle: 'More',
                navigationItems: [['', () => navigateToScreen('home'), 'Back']],
                backgroundColor: '${styling.colors.primary || '#8b5cf6'}',
                foregroundColor: 'white',
                height: 64
            }, componentConfigs.headerFooterTheme);

            HnHeaderFooter.init('more-footer', {
                navigationItems: [
                    ['', () => navigateToScreen('home'), 'Home'],
                    ['', () => navigateToScreen('more'), 'More']
                ],
                backgroundColor: '${styling.colors.primary || '#8b5cf6'}',
                foregroundColor: 'white',
                height: 70,
                position: 'footer'
            }, componentConfigs.headerFooterTheme);
        }

        // Initialize app
        function initApp() {
            setupHomeScreen();
            setupAddPostScreen();
            refreshManagePostsScreen();
            setupMoreScreen();
            navigateToScreen('home');
        }

        // Start the preview app
        initApp();
    </script>
</body>
</html>`;
}

// Export all configurations
function exportAllConfigs() {
    const allConfigs = {
        styling: currentConfigs.styling,
        settings: currentConfigs.settings,
        posts: currentConfigs.posts,
        forms: currentConfigs.forms,
        elements: currentConfigs.elements,
        exportedAt: new Date().toISOString(),
        version: "1.0.0"
    };
    
    const configJson = JSON.stringify(allConfigs, null, 2);
    
    // Copy to clipboard
    navigator.clipboard.writeText(configJson).then(() => {
        alert('🏰 All configurations have been copied to thy clipboard! The mystical JSON awaits thy use.');
    });
    
    // Also download as file
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ye-olde-app-configs.json';
    a.click();
    URL.revokeObjectURL(url);
}

// REPLACE the existing initializeEditors function with this:
function initializeEditors() {
    ['styling', 'settings', 'posts', 'forms', 'elements'].forEach(configType => {
        const editor = document.getElementById(configType + 'Config');
        
        // Add live validation listener (but don't populate with defaults yet)
        editor.addEventListener('input', function() {
            validateJSON(this.value, configType);
        });
    });
}

// ADD these new functions after the exportAllConfigs function:

// Load saved configurations from allyabase on startup
function loadSavedConfigs() {
    console.log('🏰 Attempting to load saved configurations from allyabase...');
    
    // Check if allyabase object exists
    if (typeof allyabase === 'undefined' || !allyabase) {
        console.warn('⚠️ allyabase object not found. Using default configurations.');
        loadDefaultConfigs();
        return;
    }
    
    // Check if getBDO method exists
    if (typeof allyabase.getBDO !== 'function') {
        console.warn('⚠️ allyabase.getBDO method not found. Using default configurations.');
        alert('⚠️ Warning: allyabase.getBDO method not found.\n\nUsing default configurations. The save functionality may also be unavailable.');
        loadDefaultConfigs();
        return;
    }
    
    try {
        // Call the allyabase getBDO method
        const result = allyabase.getBDO();
        
        // Handle both promise and synchronous results
        if (result && typeof result.then === 'function') {
            // It's a promise - handle async
            result.then(function(savedConfigs) {
                handleLoadedConfigs(savedConfigs);
            }).catch(function(error) {
                console.error('🏰 Error loading configurations from allyabase:', error);
                alert('❌ Error loading saved configurations:\n\n' + (error.message || error.toString()) + '\n\nUsing default configurations instead.');
                loadDefaultConfigs();
            });
        } else {
            // Synchronous result
            handleLoadedConfigs(result);
        }
        
    } catch (error) {
        console.error('🏰 Error calling allyabase.getBDO:', error);
        alert('❌ Error calling allyabase.getBDO:\n\n' + (error.message || error.toString()) + '\n\nUsing default configurations instead.');
        loadDefaultConfigs();
    }
}

// Handle the loaded configurations from allyabase
function handleLoadedConfigs(savedConfigs) {
    console.log('🏰 Received data from allyabase:', savedConfigs);
    
    // Check if we got valid saved configurations
    if (!savedConfigs || 
        typeof savedConfigs !== 'object' || 
        !savedConfigs.styling || 
        !savedConfigs.settings || 
        !savedConfigs.posts || 
        !savedConfigs.forms || 
        !savedConfigs.elements) {
        
        console.log('🏰 No valid saved configurations found. Using defaults.');
        loadDefaultConfigs();
        return;
    }
    
    // Validate that this is a ye-olde-appe-shoppe config
    if (savedConfigs.appType && savedConfigs.appType !== 'ye-olde-appe-shoppe-config') {
        console.warn('⚠️ Loaded config is not for Ye Olde Appe Shoppe. Using defaults.');
        alert('⚠️ Warning: The saved configuration is not for Ye Olde Appe Shoppe.\n\nUsing default configurations instead.');
        loadDefaultConfigs();
        return;
    }
    
    console.log('✅ Valid saved configurations found! Loading...');
    
    try {
        // Update the current configs
        currentConfigs = {
            styling: savedConfigs.styling || defaultConfigs.styling,
            settings: savedConfigs.settings || defaultConfigs.settings,
            posts: savedConfigs.posts || defaultConfigs.posts,
            forms: savedConfigs.forms || defaultConfigs.forms,
            elements: savedConfigs.elements || defaultConfigs.elements
        };
        
        // Populate the editors with saved configs
        populateEditorsWithConfigs(currentConfigs);
        
        // Update the preview
        updatePreview();
        
        // Show success message
        const savedAt = savedConfigs.savedAt ? new Date(savedConfigs.savedAt).toLocaleString() : 'unknown time';
        console.log(`🏰 Successfully loaded configurations saved at: ${savedAt}`);
        
        // Optional: Show a subtle notification that configs were loaded
        setTimeout(() => {
            console.log('🏰 Ye Olde Appe Shoppe loaded with thy saved mystical configurations! ⚔️');
        }, 1000);
        
    } catch (error) {
        console.error('🏰 Error applying saved configurations:', error);
        alert('❌ Error applying saved configurations:\n\n' + (error.message || error.toString()) + '\n\nUsing default configurations instead.');
        loadDefaultConfigs();
    }
}

// Load default configurations into editors
function loadDefaultConfigs() {
    console.log('🏰 Loading default configurations...');
    
    // Reset to defaults
    currentConfigs = { ...defaultConfigs };
    
    // Populate editors with defaults
    populateEditorsWithConfigs(defaultConfigs);
    
    // Update preview
    updatePreview();
    
    console.log('✅ Default configurations loaded successfully');
}

// Populate all editors with given configurations
function populateEditorsWithConfigs(configs) {
    ['styling', 'settings', 'posts', 'forms', 'elements'].forEach(configType => {
        const editor = document.getElementById(configType + 'Config');
        if (editor && configs[configType]) {
            editor.value = JSON.stringify(configs[configType], null, 2);
            validateJSON(editor.value, configType);
        }
    });
}

// Save all configurations via allyabase
function saveAllConfigs() {
    // Check if allyabase object exists
    if (typeof allyabase === 'undefined' || !allyabase) {
        alert('❌ Error: allyabase object not found. Cannot save configurations.\n\nMake sure allyabase is properly loaded before attempting to save.');
        return;
    }
    
    // Check if saveBDO method exists
    if (typeof allyabase.saveBDO !== 'function') {
        alert('❌ Error: allyabase.saveBDO method not found. Cannot save configurations.\n\nThe allyabase object exists but does not have the saveBDO method.');
        return;
    }
    
    // Collect all configurations (same structure as export but with save metadata)
    const allConfigs = {
        styling: currentConfigs.styling,
        settings: currentConfigs.settings,
        posts: currentConfigs.posts,
        forms: currentConfigs.forms,
        elements: currentConfigs.elements,
        savedAt: new Date().toISOString(),
        version: "1.0.0",
        appType: "ye-olde-appe-shoppe-config",
        source: "Ye Olde Appe Shoppe Configuration Tool"
    };
    
    console.log('🏰 Saving configurations to allyabase:', allConfigs);
    
    try {
        // Call the allyabase saveBDO method
        const result = allyabase.saveBDO(allConfigs);
        
        // Handle both promise and synchronous results
        if (result && typeof result.then === 'function') {
            // It's a promise - handle async
            result.then(function(response) {
                alert('✅ Success! Thy configurations have been saved to allyabase!\n\n🏰 All thy mystical JSON settings are now safely stored.');
                console.log('🏰 Save successful:', response);
            }).catch(function(error) {
                alert('❌ Error saving configurations to allyabase:\n\n' + (error.message || error.toString()));
                console.error('🏰 Save error:', error);
            });
        } else {
            // Synchronous result
            alert('✅ Success! Thy configurations have been saved to allyabase!\n\n🏰 All thy mystical JSON settings are now safely stored.');
            console.log('🏰 Save successful:', result);
        }
        
    } catch (error) {
        alert('❌ Error calling allyabase.saveBDO:\n\n' + (error.message || error.toString()) + '\n\nCheck the console for more details.');
        console.error('🏰 Save error:', error);
    }
}

// REPLACE the existing init function with this:
function init() {
    console.log('🏰 Initializing Ye Olde Appe Shoppe...');
    
    // Initialize editors first (with empty content)
    initializeEditors();
    
    // Load saved configurations (or defaults if none found)
    loadSavedConfigs();
    
    // Show welcome message
    setTimeout(() => {
        console.log('🏰 Welcome to Ye Olde Appe Shoppe! Edit thy JSON configurations to craft the perfect app! ⚔️');
        console.log('Available external components:');
        console.log('- PnPostComponent (pn namespace): Post cards and components');
        console.log('- BnButtonContainer (bn namespace): Button containers and controls');
        console.log('- FnFormWidget (fn namespace): Form creation and management');
        console.log('- HnHeaderFooter (hn namespace): Header and footer components');
        console.log('- VsVerticalStack (vs namespace): Vertical layout system');
    }, 1500);
}

// UPDATE the global exports at the bottom to include new functions:
window.loadTemplate = loadTemplate;
window.resetConfig = resetConfig;
window.updatePreview = updatePreview;
window.formatJSON = formatJSON;
window.exportAllConfigs = exportAllConfigs;
window.saveAllConfigs = saveAllConfigs;
window.loadSavedConfigs = loadSavedConfigs;
window.loadDefaultConfigs = loadDefaultConfigs;
