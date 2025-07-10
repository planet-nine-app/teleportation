// Button Container JavaScript with 'bn' namespace

// Default configuration
var bnDefaultConfig = {
    layout: 'horizontal', // 'horizontal', 'vertical', 'grid'
    alignment: 'center', // 'left', 'center', 'right', 'between', 'around', 'evenly'
    spacing: 'normal', // 'compact', 'normal', 'spacious'
    theme: 'light', // 'light', 'dark', 'custom'
    responsive: true,
    wrap: false,
    colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444'
    },
    sizing: {
        default: 'normal', // 'small', 'normal', 'large'
        containerPadding: '16px',
        buttonGap: '12px'
    }
};

// SVG Icons (reusing from post component but with bn namespace)
var bnIcons = {
    calendar: '<svg class="bn-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>',
    map: '<svg class="bn-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2" stroke="currentColor" stroke-width="2" fill="none"/><line x1="8" y1="2" x2="8" y2="18" stroke="currentColor" stroke-width="2"/><line x1="16" y1="6" x2="16" y2="22" stroke="currentColor" stroke-width="2"/></svg>',
    star: '<svg class="bn-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" stroke-width="2"/></svg>',
    heart: '<svg class="bn-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2"/></svg>',
    external: '<svg class="bn-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="2"/><polyline points="15,3 21,3 21,9" stroke="currentColor" stroke-width="2"/><line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2"/></svg>',
    rsvp: '<svg class="bn-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2"/><polyline points="17,11 19,13 23,9" stroke="currentColor" stroke-width="2"/></svg>',
    share: '<svg class="bn-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" stroke-width="2"/><polyline points="16,6 12,2 8,6" stroke="currentColor" stroke-width="2"/><line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" stroke-width="2"/></svg>',
    plus: '<svg class="bn-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/></svg>',
    edit: '<svg class="bn-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/></svg>',
    delete: '<svg class="bn-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/></svg>',
    settings: '<svg class="bn-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2"/></svg>'
};

// Utility function to generate unique IDs
function bnGenerateId() {
    return 'bn_' + Math.random().toString(36).substr(2, 9);
}

// Create a single button
function bnCreateButton(buttonConfig) {
    var button = document.createElement('button');
    button.className = 'bn-button';
    button.type = 'button';
    
    // Apply button ID
    if (buttonConfig.id) {
        button.id = buttonConfig.id;
        button.setAttribute('data-button-id', buttonConfig.id);
    }
    
    // Apply styles
    var style = buttonConfig.style || 'primary';
    button.classList.add('bn-' + style);
    
    // Apply size
    var size = buttonConfig.size || 'normal';
    if (size !== 'normal') {
        button.classList.add('bn-' + size);
    }
    
    // Apply width
    if (buttonConfig.fullWidth) {
        button.classList.add('bn-full-width');
    }
    
    // Apply icon-only mode
    if (buttonConfig.iconOnly) {
        button.classList.add('bn-icon-only');
    }
    
    // Apply disabled state
    if (buttonConfig.disabled) {
        button.disabled = true;
    }
    
    // Apply loading state
    if (buttonConfig.loading) {
        button.classList.add('bn-loading');
        button.disabled = true;
    }
    
    // Add content
    var content = '';
    
    // Add icon if specified
    if (buttonConfig.icon && bnIcons[buttonConfig.icon]) {
        content += bnIcons[buttonConfig.icon];
    }
    
    // Add text if not icon-only
    if (!buttonConfig.iconOnly && buttonConfig.text) {
        content += '<span>' + buttonConfig.text + '</span>';
    }
    
    button.innerHTML = content;
    
    // Add click handler
    if (buttonConfig.onClick && typeof buttonConfig.onClick === 'function') {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (!button.disabled) {
                buttonConfig.onClick(buttonConfig.id || null, buttonConfig);
            }
        });
    }
    
    // Add accessibility
    if (buttonConfig.ariaLabel) {
        button.setAttribute('aria-label', buttonConfig.ariaLabel);
    } else if (buttonConfig.iconOnly && buttonConfig.text) {
        button.setAttribute('aria-label', buttonConfig.text);
    }
    
    // Add tooltip if specified
    if (buttonConfig.tooltip) {
        button.title = buttonConfig.tooltip;
    }
    
    return button;
}

// Create button container
function bnCreateButtonContainer(buttons, config) {
    config = config || bnDefaultConfig;
    
    var container = document.createElement('div');
    container.className = 'bn-button-container';
    
    // Apply layout
    var layout = config.layout || 'horizontal';
    container.classList.add('bn-' + layout);
    
    // Apply alignment
    var alignment = config.alignment || 'center';
    container.classList.add('bn-align-' + alignment);
    
    // Apply spacing
    var spacing = config.spacing || 'normal';
    if (spacing !== 'normal') {
        container.classList.add('bn-' + spacing);
    }
    
    // Apply theme
    var theme = config.theme || 'light';
    if (theme !== 'light') {
        container.classList.add('bn-' + theme + '-theme');
    }
    
    // Apply responsive
    if (config.responsive) {
        container.classList.add('bn-responsive');
    }
    
    // Apply wrap
    if (config.wrap) {
        container.classList.add('bn-wrap');
    }
    
    // Apply custom CSS variables
    if (config.colors) {
        Object.keys(config.colors).forEach(function(key) {
            container.style.setProperty('--bn-' + key + '-bg', config.colors[key]);
        });
    }
    
    if (config.sizing) {
        Object.keys(config.sizing).forEach(function(key) {
            if (key === 'containerPadding') {
                container.style.setProperty('--bn-container-padding', config.sizing[key]);
            } else if (key === 'buttonGap') {
                container.style.setProperty('--bn-container-gap', config.sizing[key]);
            }
        });
    }
    
    // Add custom height if specified
    if (config.height) {
        container.style.setProperty('--bn-container-min-height', config.height);
    }
    
    // Add custom width if specified
    if (config.width) {
        container.style.setProperty('--bn-container-width', config.width);
    }
    
    // Create buttons
    if (Array.isArray(buttons)) {
        buttons.forEach(function(buttonConfig) {
            var button = bnCreateButton(buttonConfig);
            container.appendChild(button);
        });
    }
    
    return container;
}

// Update button in container
function bnUpdateButton(containerId, buttonId, updates) {
    var container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    var button = container.querySelector('[data-button-id="' + buttonId + '"]');
    if (!button) {
        console.error('Button not found:', buttonId);
        return;
    }
    
    // Update properties
    if (updates.text !== undefined) {
        var textSpan = button.querySelector('span');
        if (textSpan) {
            textSpan.textContent = updates.text;
        }
    }
    
    if (updates.disabled !== undefined) {
        button.disabled = updates.disabled;
    }
    
    if (updates.loading !== undefined) {
        if (updates.loading) {
            button.classList.add('bn-loading');
            button.disabled = true;
        } else {
            button.classList.remove('bn-loading');
        }
    }
    
    if (updates.style !== undefined) {
        // Remove existing style classes
        button.classList.forEach(function(className) {
            if (className.startsWith('bn-') && 
                ['bn-primary', 'bn-secondary', 'bn-success', 'bn-warning', 'bn-danger', 'bn-outline', 'bn-ghost', 'bn-text'].includes(className)) {
                button.classList.remove(className);
            }
        });
        button.classList.add('bn-' + updates.style);
    }
}

// Remove button from container
function bnRemoveButton(containerId, buttonId) {
    var container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    var button = container.querySelector('[data-button-id="' + buttonId + '"]');
    if (button) {
        button.remove();
    }
}

// Add button to container
function bnAddButton(containerId, buttonConfig, position) {
    var container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    var button = bnCreateButton(buttonConfig);
    
    if (position === 'start') {
        container.insertBefore(button, container.firstChild);
    } else if (typeof position === 'number') {
        var referenceNode = container.children[position];
        if (referenceNode) {
            container.insertBefore(button, referenceNode);
        } else {
            container.appendChild(button);
        }
    } else {
        container.appendChild(button);
    }
    
    return button;
}

// Get all button states
function bnGetButtonStates(containerId) {
    var container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return null;
    }
    
    var states = {};
    var buttons = container.querySelectorAll('.bn-button[data-button-id]');
    
    buttons.forEach(function(button) {
        var buttonId = button.getAttribute('data-button-id');
        states[buttonId] = {
            disabled: button.disabled,
            loading: button.classList.contains('bn-loading'),
            text: button.querySelector('span') ? button.querySelector('span').textContent : '',
            style: Array.from(button.classList).find(function(cls) {
                return cls.startsWith('bn-') && 
                    ['bn-primary', 'bn-secondary', 'bn-success', 'bn-warning', 'bn-danger', 'bn-outline', 'bn-ghost', 'bn-text'].includes(cls);
            })?.replace('bn-', '') || 'primary'
        };
    });
    
    return states;
}

// Generic initialization function
function bnInitButtonContainer(container, buttons, config, options) {
    options = options || {};
    
    // Handle container
    if (typeof container === 'string') {
        container = document.getElementById(container);
    }
    
    if (!container) {
        console.error('Container not found');
        return null;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create button container
    var containerId = options.containerId || bnGenerateId();
    var buttonContainer = bnCreateButtonContainer(buttons, config);
    buttonContainer.id = containerId;
    
    // Add to container
    container.appendChild(buttonContainer);
    
    // Return utilities
    return {
        containerId: containerId,
        element: buttonContainer,
        updateButton: function(buttonId, updates) {
            bnUpdateButton(containerId, buttonId, updates);
        },
        removeButton: function(buttonId) {
            bnRemoveButton(containerId, buttonId);
        },
        addButton: function(buttonConfig, position) {
            return bnAddButton(containerId, buttonConfig, position);
        },
        getButtonStates: function() {
            return bnGetButtonStates(containerId);
        },
        destroy: function() {
            if (buttonContainer.parentNode) {
                buttonContainer.parentNode.removeChild(buttonContainer);
            }
        }
    };
}

// Export for use in other environments
if (typeof window !== 'undefined') {
    window.BnButtonContainer = {
        create: bnCreateButtonContainer,
        init: bnInitButtonContainer,
        createButton: bnCreateButton,
        updateButton: bnUpdateButton,
        removeButton: bnRemoveButton,
        addButton: bnAddButton,
        getButtonStates: bnGetButtonStates,
        defaultConfig: bnDefaultConfig,
        icons: bnIcons
    };
}
