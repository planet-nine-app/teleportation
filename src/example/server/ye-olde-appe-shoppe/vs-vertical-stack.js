/**
 * vs-vertical-stack.js
 * Vertical Stack Layout System with 'vs' namespace
 */

// Default configuration for vertical stack
var vsDefaultConfig = {
    spacing: '20px',
    padding: '20px',
    alignment: 'stretch', // 'stretch', 'center', 'start', 'end'
    maxWidth: '600px',
    backgroundColor: 'transparent',
    borderRadius: '0px'
};

/**
 * Creates a vertical stack container with elements
 * @param {Array} elements - Array of element configurations
 * @param {Object} config - Stack configuration (optional)
 * @returns {HTMLElement} The created vertical stack element
 */
function vsCreateVerticalStack(elements, config) {
    config = config || vsDefaultConfig;
    
    // Create container
    var container = document.createElement('div');
    container.className = 'vs-vertical-stack';
    
    // Apply container styles
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = config.spacing || '20px';
    container.style.padding = config.padding || '20px';
    container.style.maxWidth = config.maxWidth || '600px';
    container.style.margin = '0 auto';
    container.style.backgroundColor = config.backgroundColor || 'transparent';
    container.style.borderRadius = config.borderRadius || '0px';
    container.style.boxSizing = 'border-box';
    
    // Apply alignment
    var alignment = config.alignment || 'stretch';
    switch (alignment) {
        case 'center':
            container.style.alignItems = 'center';
            break;
        case 'start':
            container.style.alignItems = 'flex-start';
            break;
        case 'end':
            container.style.alignItems = 'flex-end';
            break;
        case 'stretch':
        default:
            container.style.alignItems = 'stretch';
            break;
    }
    
    // Create elements
    if (Array.isArray(elements)) {
        elements.forEach(function(elementConfig, index) {
            var element = vsCreateElement(elementConfig, index);
            if (element) {
                container.appendChild(element);
            }
        });
    }
    
    return container;
}

/**
 * Creates an individual element based on configuration
 * @param {Object} elementConfig - Element configuration
 * @param {number} index - Element index for unique IDs
 * @returns {HTMLElement|null} The created element or null if type unknown
 */
function vsCreateElement(elementConfig, index) {
    var type = elementConfig.type;
    var element = null;
    
    switch (type) {
        case 'image':
            element = vsCreateImageElement(elementConfig, index);
            break;
            
        case 'text':
            element = vsCreateTextElement(elementConfig, index);
            break;
            
        case 'button':
            element = vsCreateButtonElement(elementConfig, index);
            break;
            
        case 'buttons':
            element = vsCreateButtonsElement(elementConfig, index);
            break;
            
        case 'spacer':
            element = vsCreateSpacerElement(elementConfig, index);
            break;
            
        default:
            console.warn('Unknown element type:', type);
            return null;
    }
    
    // Apply common element styling if specified
    if (element && elementConfig.style) {
        Object.keys(elementConfig.style).forEach(function(key) {
            element.style[key] = elementConfig.style[key];
        });
    }
    
    // Add element ID if specified
    if (element && elementConfig.id) {
        element.id = elementConfig.id;
        element.setAttribute('data-element-id', elementConfig.id);
    }
    
    return element;
}

/**
 * Creates an image element
 */
function vsCreateImageElement(config, index) {
    // Check if image element creator is available
    if (typeof window.IeImageElement !== 'undefined') {
        return window.IeImageElement.create({
            imageUri: config.imageUri || config.src || '',
            width: config.width || 'auto',
            height: config.height || 'auto',
            alt: config.alt || '',
            borderRadius: config.borderRadius || '8px',
            objectFit: config.objectFit || 'cover',
            onPress: config.onPress || config.onClick || null,
            style: config.imageStyle || {}
        });
    } else {
        // Fallback if image element not available
        var img = document.createElement('img');
        img.src = config.imageUri || config.src || '';
        img.alt = config.alt || '';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = config.borderRadius || '8px';
        return img;
    }
}

/**
 * Creates a text element
 */
function vsCreateTextElement(config, index) {
    // Check if text element creator is available
    if (typeof window.TeTextElement !== 'undefined') {
        return window.TeTextElement.create({
            text: config.text || '',
            color: config.color || 'inherit',
            textAlign: config.textAlign || 'left',
            fontFamily: config.fontFamily || undefined,
            lineHeight: config.lineHeight || 1.4,
            maxWidth: config.maxWidth || null,
            onPress: config.onPress || config.onClick || null,
            style: config.textStyle || {}
        });
    } else {
        // Fallback if text element not available
        var textEl = document.createElement('div');
        textEl.textContent = config.text || '';
        textEl.style.color = config.color || 'inherit';
        textEl.style.textAlign = config.textAlign || 'left';
        return textEl;
    }
}

/**
 * Creates a single button element
 */
function vsCreateButtonElement(config, index) {
    // Check if button container is available
    if (typeof window.BnButtonContainer !== 'undefined') {
        var buttonConfig = {
            id: config.id || 'vs-button-' + index,
            text: config.text || 'Button',
            icon: config.icon || null,
            style: config.buttonStyle || 'primary',
            size: config.size || 'normal',
            fullWidth: config.fullWidth !== false, // Default to full width
            onClick: config.onPress || config.onClick || function() {
                console.log('Button clicked:', config.text);
            }
        };
        
        return window.BnButtonContainer.createButton(buttonConfig);
    } else {
        // Fallback if button container not available
        var button = document.createElement('button');
        button.textContent = config.text || 'Button';
        button.style.padding = '12px 24px';
        button.style.backgroundColor = '#3b82f6';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';
        return button;
    }
}

/**
 * Creates a container with multiple buttons
 */
function vsCreateButtonsElement(config, index) {
    // Check if button container is available
    if (typeof window.BnButtonContainer !== 'undefined') {
        var buttonsConfig = config.buttons || [];
        var containerConfig = {
            layout: config.layout || 'horizontal',
            alignment: config.alignment || 'center',
            spacing: config.spacing || 'normal',
            theme: config.theme || 'light'
        };
        
        // Create wrapper div
        var wrapper = document.createElement('div');
        wrapper.className = 'vs-buttons-wrapper';
        
        // Initialize button container
        var buttonContainer = window.BnButtonContainer.create(buttonsConfig, containerConfig);
        wrapper.appendChild(buttonContainer);
        
        return wrapper;
    } else {
        // Fallback if button container not available
        var container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '12px';
        container.style.justifyContent = 'center';
        
        (config.buttons || []).forEach(function(buttonConfig) {
            var button = document.createElement('button');
            button.textContent = buttonConfig.text || 'Button';
            button.style.padding = '12px 24px';
            button.style.backgroundColor = '#3b82f6';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '6px';
            button.style.cursor = 'pointer';
            container.appendChild(button);
        });
        
        return container;
    }
}

/**
 * Creates a spacer element
 */
function vsCreateSpacerElement(config, index) {
    var spacer = document.createElement('div');
    spacer.className = 'vs-spacer';
    spacer.style.height = config.height || '20px';
    spacer.style.width = '100%';
    if (config.backgroundColor) {
        spacer.style.backgroundColor = config.backgroundColor;
    }
    return spacer;
}

/**
 * Generic initialization function
 * @param {string|HTMLElement} container - Container element or ID
 * @param {Array} elements - Array of element configurations
 * @param {Object} config - Stack configuration (optional)
 * @returns {HTMLElement} The created vertical stack element
 */
function vsInitVerticalStack(container, elements, config) {
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
    
    // Create vertical stack
    var verticalStack = vsCreateVerticalStack(elements, config);
    
    // Add to container
    container.appendChild(verticalStack);
    
    return verticalStack;
}

/**
 * Update an element in the stack
 * @param {string} stackId - Stack container ID
 * @param {string} elementId - Element ID to update
 * @param {Object} updates - Properties to update
 */
function vsUpdateElement(stackId, elementId, updates) {
    var stack = document.getElementById(stackId);
    if (!stack) {
        console.error('Stack not found:', stackId);
        return;
    }
    
    var element = stack.querySelector('[data-element-id="' + elementId + '"]');
    if (!element) {
        console.error('Element not found:', elementId);
        return;
    }
    
    // Handle different update types
    if (updates.text && element.classList.contains('te-text-element')) {
        // Update text content
        element.innerHTML = window.TeTextElement ? 
            window.TeTextElement.parseMarkdown(updates.text) : 
            updates.text;
    }
    
    if (updates.src && element.classList.contains('ie-image-container')) {
        // Update image source
        var img = element.querySelector('img');
        if (img) {
            img.src = updates.src;
        }
    }
    
    // Apply style updates
    if (updates.style) {
        Object.keys(updates.style).forEach(function(key) {
            element.style[key] = updates.style[key];
        });
    }
}

// Export for use in other environments
if (typeof window !== 'undefined') {
    window.VsVerticalStack = {
        create: vsCreateVerticalStack,
        init: vsInitVerticalStack,
        createElement: vsCreateElement,
        updateElement: vsUpdateElement,
        defaultConfig: vsDefaultConfig
    };
}
