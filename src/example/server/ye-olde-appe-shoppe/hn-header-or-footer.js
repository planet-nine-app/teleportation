/**
 * hn-header-footer.js
 * Header/Footer Component with 'hn' namespace
 */

// Default theme object
var hnDefaultTheme = {
  colors: {
    gray: '#6b7280',
    primary: '#3b82f6',
    background: '#ffffff',
    foreground: '#000000'
  },
  spacing: {
    padding: '16px',
    gap: '12px'
  },
  typography: {
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }
};

/**
 * Creates a header or footer element
 * @param {Object} props - Component properties
 * @param {string} props.headerTitle - Title text (if null/undefined, becomes navigation bar)
 * @param {Array} props.navigationItems - Array of [imageUri, onPress] tuples
 * @param {string} props.backgroundColor - Background color
 * @param {string} props.foregroundColor - Text/icon color
 * @param {number} props.height - Height of the component (optional, default 60)
 * @param {string} props.position - 'header' or 'footer' for positioning (optional)
 * @param {Object} theme - Theme object (optional)
 * @returns {HTMLElement} The created header/footer element
 */
function hnCreateHeaderFooter(props, theme) {
  // Use provided theme or default
  theme = theme || hnDefaultTheme;
  
  // Set props with defaults
  var headerTitle = props.headerTitle;
  var navigationItems = props.navigationItems || [];
  var backgroundColor = props.backgroundColor || theme.colors.gray;
  var foregroundColor = props.foregroundColor || theme.colors.foreground;
  var height = props.height || 60;
  var position = props.position || 'header';
  
  // Create container div that spans full width
  var container = document.createElement('div');
  container.className = 'hn-header-footer hn-' + position;
  container.style.width = '100%';
  container.style.height = height + 'px';
  container.style.backgroundColor = backgroundColor;
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.position = 'relative';
  container.style.boxSizing = 'border-box';
  container.style.padding = '0 ' + (theme.spacing.padding || '16px');
  container.style.borderBottom = position === 'header' ? '1px solid rgba(0,0,0,0.1)' : 'none';
  container.style.borderTop = position === 'footer' ? '1px solid rgba(0,0,0,0.1)' : 'none';
  
  // If headerTitle exists, create header layout
  if (headerTitle) {
    // Create title element
    var titleElement = document.createElement('div');
    titleElement.className = 'hn-title';
    titleElement.style.color = foregroundColor;
    titleElement.style.fontSize = theme.typography.fontSize || '18px';
    titleElement.style.fontWeight = theme.typography.fontWeight || 'bold';
    titleElement.style.fontFamily = theme.typography.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    titleElement.style.flex = '1';
    titleElement.style.textAlign = 'center';
    titleElement.textContent = headerTitle;
    
    // Add navigation items to the right side
    var navContainer = document.createElement('div');
    navContainer.className = 'hn-nav-container';
    navContainer.style.display = 'flex';
    navContainer.style.alignItems = 'center';
    navContainer.style.gap = theme.spacing.gap || '12px';
    navContainer.style.position = 'absolute';
    navContainer.style.right = theme.spacing.padding || '16px';
    
    navigationItems.forEach(function(item, index) {
      var imageUri = item[0];
      var onPress = item[1];
      var label = item[2] || 'Navigation item ' + (index + 1); // Accessibility
      
      var navButton = hnCreateNavigationButton(imageUri, onPress, foregroundColor, height * 0.5, label);
      navContainer.appendChild(navButton);
    });
    
    container.appendChild(titleElement);
    container.appendChild(navContainer);
    
  } else {
    // No header title - distribute navigation items evenly
    container.style.justifyContent = 'space-evenly';
    container.style.padding = '0 8px';
    
    navigationItems.forEach(function(item, index) {
      var imageUri = item[0];
      var onPress = item[1];
      var label = item[2] || 'Navigation item ' + (index + 1); // Accessibility
      
      var navButton = hnCreateNavigationButton(imageUri, onPress, foregroundColor, height * 0.6, label);
      container.appendChild(navButton);
    });
  }
  
  return container;
}

/**
 * Creates a navigation button with image
 * @param {string} imageUri - URI/path to the image
 * @param {Function} onPress - Click callback
 * @param {string} color - Tint color for the button
 * @param {number} size - Size of the button
 * @param {string} label - Accessibility label
 * @returns {HTMLElement} Navigation button element
 */
function hnCreateNavigationButton(imageUri, onPress, color, size, label) {
  var button = document.createElement('div');
  button.className = 'hn-nav-button';
  button.style.width = size + 'px';
  button.style.height = size + 'px';
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.cursor = 'pointer';
  button.style.borderRadius = '8px';
  button.style.transition = 'all 0.2s ease';
  button.style.position = 'relative';
  button.setAttribute('tabindex', '0');
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', label);
  
  // Create image element
  var img = document.createElement('img');
  img.src = imageUri;
  img.alt = label;
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'contain';
  img.style.filter = 'brightness(0) saturate(100%) ' + hnGetColorFilter(color);
  img.style.transition = 'all 0.2s ease';
  
  // Handle image load error - create SVG fallback
  img.addEventListener('error', function() {
    var fallbackSvg = hnCreateFallbackIcon(size, color);
    button.replaceChild(fallbackSvg, img);
  });
  
  button.appendChild(img);
  
  // Add interaction handlers
  button.addEventListener('mouseenter', function() {
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    button.style.transform = 'scale(1.05)';
  });
  
  button.addEventListener('mouseleave', function() {
    button.style.backgroundColor = 'transparent';
    button.style.transform = 'scale(1)';
  });
  
  button.addEventListener('mousedown', function() {
    button.style.transform = 'scale(0.95)';
  });
  
  button.addEventListener('mouseup', function() {
    button.style.transform = 'scale(1.05)';
  });
  
  button.addEventListener('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    if (onPress) {
      onPress();
    }
  });
  
  // Keyboard support
  button.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onPress) {
        onPress();
      }
    }
  });
  
  // Focus styles
  button.addEventListener('focus', function() {
    button.style.outline = '2px solid ' + color;
    button.style.outlineOffset = '2px';
  });
  
  button.addEventListener('blur', function() {
    button.style.outline = 'none';
  });
  
  return button;
}

/**
 * Creates a fallback SVG icon when image fails to load
 * @param {number} size - Size of the icon
 * @param {string} color - Color of the icon
 * @returns {SVGElement} Fallback SVG icon
 */
function hnCreateFallbackIcon(size, color) {
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  
  // Simple circle with dot - generic icon
  var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '12');
  circle.setAttribute('r', '10');
  circle.setAttribute('stroke', color);
  circle.setAttribute('stroke-width', '2');
  
  var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  dot.setAttribute('cx', '12');
  dot.setAttribute('cy', '12');
  dot.setAttribute('r', '3');
  dot.setAttribute('fill', color);
  
  svg.appendChild(circle);
  svg.appendChild(dot);
  
  return svg;
}

/**
 * Converts a color to CSS filter for image tinting
 * @param {string} color - Target color
 * @returns {string} CSS filter string
 */
function hnGetColorFilter(color) {
  var colorMap = {
    'black': 'invert(0%)',
    'white': 'invert(100%)',
    'red': 'invert(20%) sepia(100%) saturate(2000%) hue-rotate(0deg)',
    'blue': 'invert(20%) sepia(100%) saturate(2000%) hue-rotate(240deg)',
    'green': 'invert(20%) sepia(100%) saturate(2000%) hue-rotate(120deg)',
    'gray': 'invert(50%)',
    'grey': 'invert(50%)',
    'purple': 'invert(20%) sepia(100%) saturate(2000%) hue-rotate(280deg)',
    'orange': 'invert(20%) sepia(100%) saturate(2000%) hue-rotate(30deg)'
  };
  
  return colorMap[color.toLowerCase()] || 'invert(0%)';
}

/**
 * Generic initialization function
 * @param {string|HTMLElement} container - Container element or ID
 * @param {Object} props - Header/footer properties
 * @param {Object} theme - Optional theme configuration
 * @returns {HTMLElement} The created header/footer element
 */
function hnInitHeaderFooter(container, props, theme) {
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
  
  // Create header/footer
  var headerFooter = hnCreateHeaderFooter(props, theme);
  
  // Add to container
  container.appendChild(headerFooter);
  
  return headerFooter;
}

// Export for use in other environments
if (typeof window !== 'undefined') {
  window.HnHeaderFooter = {
    create: hnCreateHeaderFooter,
    init: hnInitHeaderFooter,
    createNavigationButton: hnCreateNavigationButton,
    defaultTheme: hnDefaultTheme
  };
  
  // Legacy support
  window.headerOrFooter = hnCreateHeaderFooter;
}
