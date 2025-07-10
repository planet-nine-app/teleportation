// Form Widget JavaScript with 'fn' namespace

// Default configuration
var fnDefaultConfig = {
    theme: 'dark', // 'dark', 'light', or 'custom'
    colors: {
        primary: '#8b5cf6',
        secondary: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981'
    },
    spacing: {
        fieldMargin: '20px',
        padding: '20px',
        borderRadius: '8px'
    },
    typography: {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif'
    }
};

// Form instance storage
var fnFormInstances = {};

// Utility function to generate unique IDs
function fnGenerateId(name) {
    return name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
}

// Utility function to format datetime for display
function fnFormatDateTime(startTime, endTime) {
    if (!startTime || !endTime) return '';
    
    var start = new Date(startTime);
    var end = new Date(endTime);
    
    var options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    
    var startStr = start.toLocaleDateString('en-US', options);
    var endStr = end.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    return `${startStr} - ${endStr}`;
}

// Create text input field
function fnCreateTextInput(name, config, formId) {
    var fieldId = fnGenerateId(name);
    var inputId = `${fieldId}Input`;
    
    var fieldDiv = document.createElement('div');
    fieldDiv.className = 'fn-form-field';
    
    var label = document.createElement('label');
    label.className = 'fn-form-label';
    label.textContent = name;
    label.setAttribute('for', inputId);
    
    var input = document.createElement('input');
    input.type = 'text';
    input.id = inputId;
    input.className = 'fn-form-input';
    input.placeholder = config.placeholder || `Enter ${name.toLowerCase()}`;
    input.value = config.value || '';
    
    if (config.required) {
        input.required = true;
        label.textContent += ' *';
    }
    
    fieldDiv.appendChild(label);
    fieldDiv.appendChild(input);
    
    return fieldDiv;
}

// Create textarea field
function fnCreateTextarea(name, config, formId) {
    var fieldId = fnGenerateId(name);
    var textareaId = `${fieldId}Textarea`;
    var counterId = `${fieldId}Counter`;
    
    var fieldDiv = document.createElement('div');
    fieldDiv.className = 'fn-form-field';
    
    var label = document.createElement('label');
    label.className = 'fn-form-label';
    label.textContent = name;
    label.setAttribute('for', textareaId);
    
    var textarea = document.createElement('textarea');
    textarea.id = textareaId;
    textarea.className = 'fn-form-textarea';
    textarea.placeholder = config.placeholder || `Enter ${name.toLowerCase()}`;
    textarea.value = config.value || '';
    
    var charLimit = config.charLimit || 500;
    textarea.maxLength = charLimit;
    
    if (config.required) {
        textarea.required = true;
        label.textContent += ' *';
    }
    
    var counter = document.createElement('div');
    counter.id = counterId;
    counter.className = 'fn-char-counter';
    counter.textContent = `${textarea.value.length}/${charLimit}`;
    
    // Add character counter functionality
    textarea.addEventListener('input', function() {
        var length = textarea.value.length;
        counter.textContent = `${length}/${charLimit}`;
        
        counter.className = 'fn-char-counter';
        if (length > charLimit * 0.9) {
            counter.classList.add('fn-warning');
        }
        if (length >= charLimit) {
            counter.classList.add('fn-error');
        }
    });
    
    fieldDiv.appendChild(label);
    fieldDiv.appendChild(textarea);
    fieldDiv.appendChild(counter);
    
    return fieldDiv;
}

// Create datetime field
function fnCreateDatetime(name, config, formId) {
    var fieldId = fnGenerateId(name);
    var formInstance = fnFormInstances[formId];
    
    if (!formInstance.dateTimes) {
        formInstance.dateTimes = [];
    }
    
    var fieldDiv = document.createElement('div');
    fieldDiv.className = 'fn-form-field';
    
    var label = document.createElement('label');
    label.className = 'fn-form-label';
    label.textContent = name;
    
    var datetimeSection = document.createElement('div');
    datetimeSection.className = 'fn-datetime-section';
    
    var grid = document.createElement('div');
    grid.className = 'fn-datetime-grid';
    
    // Start time field
    var startField = document.createElement('div');
    startField.className = 'fn-datetime-field';
    
    var startLabel = document.createElement('label');
    startLabel.className = 'fn-datetime-label';
    startLabel.textContent = 'Start Time';
    
    var startInput = document.createElement('input');
    startInput.type = 'datetime-local';
    startInput.className = 'fn-time-input';
    startInput.id = `${fieldId}StartTime`;
    
    startField.appendChild(startLabel);
    startField.appendChild(startInput);
    
    // End time field
    var endField = document.createElement('div');
    endField.className = 'fn-datetime-field';
    
    var endLabel = document.createElement('label');
    endLabel.className = 'fn-datetime-label';
    endLabel.textContent = 'End Time';
    
    var endInput = document.createElement('input');
    endInput.type = 'datetime-local';
    endInput.className = 'fn-time-input';
    endInput.id = `${fieldId}EndTime`;
    
    endField.appendChild(endLabel);
    endField.appendChild(endInput);
    
    grid.appendChild(startField);
    grid.appendChild(endField);
    
    // Add event button
    var addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'fn-add-event-btn';
    addButton.textContent = 'Add Event';
    
    // Events list
    var eventsList = document.createElement('div');
    eventsList.className = 'fn-events-list';
    eventsList.id = `${fieldId}EventsList`;
    
    addButton.addEventListener('click', function() {
        var startTime = startInput.value;
        var endTime = endInput.value;
        
        if (!startTime || !endTime) {
            alert('Please select both start and end times');
            return;
        }
        
        if (new Date(startTime) >= new Date(endTime)) {
            alert('End time must be after start time');
            return;
        }
        
        var event = {
            startDateTime: new Date(startTime).getTime(),
            endDateTime: new Date(endTime).getTime()
        };
        
        formInstance.dateTimes.push(event);
        fnUpdateEventsList(eventsList, formInstance.dateTimes, formId);
        
        // Clear inputs
        startInput.value = '';
        endInput.value = '';
    });
    
    datetimeSection.appendChild(grid);
    datetimeSection.appendChild(addButton);
    datetimeSection.appendChild(eventsList);
    
    fieldDiv.appendChild(label);
    fieldDiv.appendChild(datetimeSection);
    
    return fieldDiv;
}

// Update events list display
function fnUpdateEventsList(eventsList, dateTimes, formId) {
    eventsList.innerHTML = '';
    
    dateTimes.forEach(function(event, index) {
        var eventItem = document.createElement('div');
        eventItem.className = 'fn-event-item';
        
        var eventText = document.createElement('span');
        eventText.className = 'fn-event-text';
        eventText.textContent = fnFormatDateTime(event.startDateTime, event.endDateTime);
        
        var removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'fn-remove-event-btn';
        removeButton.textContent = 'Remove';
        
        removeButton.addEventListener('click', function() {
            var formInstance = fnFormInstances[formId];
            formInstance.dateTimes.splice(index, 1);
            fnUpdateEventsList(eventsList, formInstance.dateTimes, formId);
        });
        
        eventItem.appendChild(eventText);
        eventItem.appendChild(removeButton);
        eventsList.appendChild(eventItem);
    });
}

// Create image upload field
function fnCreateImageUpload(name, config, formId) {
    var fieldId = fnGenerateId(name);
    var formInstance = fnFormInstances[formId];
    
    if (!formInstance.imageData) {
        formInstance.imageData = {};
    }
    
    var fieldDiv = document.createElement('div');
    fieldDiv.className = 'fn-form-field';
    
    var label = document.createElement('label');
    label.className = 'fn-form-label';
    label.textContent = name;
    
    var uploadContainer = document.createElement('div');
    uploadContainer.className = 'fn-image-upload-container';
    uploadContainer.id = `${fieldId}Upload`;
    
    var uploadText = document.createElement('div');
    uploadText.className = 'fn-image-upload-text';
    uploadText.textContent = '📸 Click to upload an image';
    
    var urlLabel = document.createElement('p');
    urlLabel.style.fontSize = '12px';
    urlLabel.style.color = '#666';
    urlLabel.style.marginTop = '10px';
    urlLabel.textContent = 'Or paste an image URL:';
    
    var urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.className = 'fn-image-url-input';
    urlInput.placeholder = 'https://example.com/image.jpg';
    urlInput.style.marginTop = '10px';
    
    urlInput.addEventListener('change', function() {
        var imageUrl = urlInput.value.trim();
        if (imageUrl) {
            fnSetImagePreview(uploadContainer, imageUrl, fieldId, formId);
        }
    });
    
    uploadContainer.appendChild(uploadText);
    uploadContainer.appendChild(urlLabel);
    uploadContainer.appendChild(urlInput);
    
    // Handle file upload (if supported)
    uploadContainer.addEventListener('click', function(e) {
        if (e.target === urlInput) return;
        
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', function() {
            var file = fileInput.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    fnSetImagePreview(uploadContainer, e.target.result, fieldId, formId);
                };
                reader.readAsDataURL(file);
            }
        });
        
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    });
    
    fieldDiv.appendChild(label);
    fieldDiv.appendChild(uploadContainer);
    
    return fieldDiv;
}

// Set image preview
function fnSetImagePreview(container, imageUrl, fieldId, formId) {
    var formInstance = fnFormInstances[formId];
    formInstance.imageData[fieldId] = imageUrl;
    
    container.innerHTML = '';
    container.classList.add('fn-has-image');
    
    var img = document.createElement('img');
    img.src = imageUrl;
    img.className = 'fn-image-preview';
    img.alt = 'Preview';
    
    var removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'fn-remove-image-btn';
    removeButton.textContent = 'Remove';
    
    removeButton.addEventListener('click', function() {
        delete formInstance.imageData[fieldId];
        container.classList.remove('fn-has-image');
        
        // Reset to upload state
        container.innerHTML = '';
        var uploadText = document.createElement('div');
        uploadText.className = 'fn-image-upload-text';
        uploadText.textContent = '📸 Click to upload an image';
        
        var urlLabel = document.createElement('p');
        urlLabel.style.fontSize = '12px';
        urlLabel.style.color = '#666';
        urlLabel.style.marginTop = '10px';
        urlLabel.textContent = 'Or paste an image URL:';
        
        var urlInput = document.createElement('input');
        urlInput.type = 'url';
        urlInput.className = 'fn-image-url-input';
        urlInput.placeholder = 'https://example.com/image.jpg';
        urlInput.style.marginTop = '10px';
        
        urlInput.addEventListener('change', function() {
            var imageUrl = urlInput.value.trim();
            if (imageUrl) {
                fnSetImagePreview(container, imageUrl, fieldId, formId);
            }
        });
        
        container.appendChild(uploadText);
        container.appendChild(urlLabel);
        container.appendChild(urlInput);
    });
    
    container.appendChild(img);
    container.appendChild(removeButton);
}

// Create text block
function fnCreateTextBlock(content, config, formId) {
    var textBlock = document.createElement('div');
    textBlock.className = 'fn-text-block';
    textBlock.textContent = content || 'Text block content';
    
    return textBlock;
}

// Main form creation function
function fnCreateForm(formConfig, config, formId) {
    config = config || fnDefaultConfig;
    formId = formId || 'form_' + Math.random().toString(36).substr(2, 9);
    
    // Initialize form instance
    fnFormInstances[formId] = {
        dateTimes: [],
        imageData: {},
        config: config
    };
    
    var form = document.createElement('div');
    form.className = 'fn-form-widget';
    form.id = formId;
    
    // Apply theme
    if (config.theme === 'light') {
        form.classList.add('fn-light-theme');
    } else if (config.theme === 'dark') {
        form.classList.add('fn-dark-theme');
    }
    
    // Apply custom CSS variables if provided
    if (config.colors) {
        Object.keys(config.colors).forEach(function(key) {
            form.style.setProperty(`--form-${key}`, config.colors[key]);
        });
    }
    
    // Process form fields
    if (Array.isArray(formConfig)) {
        // New format: array of field objects
        formConfig.forEach(function(field) {
            var fieldElement = fnCreateFieldElement(field, formId);
            if (fieldElement) {
                form.appendChild(fieldElement);
            }
        });
    } else {
        // Legacy format: object with field names as keys
        Object.keys(formConfig).forEach(function(fieldName) {
            var fieldConfig = formConfig[fieldName];
            var fieldElement = fnCreateFieldByType(fieldName, fieldConfig, formId);
            if (fieldElement) {
                form.appendChild(fieldElement);
            }
        });
    }
    
    return form;
}

// Create field element from new format
function fnCreateFieldElement(field, formId) {
    switch (field.type) {
        case 'text':
            return fnCreateTextInput(field.name || field.label, field, formId);
        case 'textarea':
            return fnCreateTextarea(field.name || field.label, field, formId);
        case 'datetime':
            return fnCreateDatetime(field.name || field.label, field, formId);
        case 'image':
            return fnCreateImageUpload(field.name || field.label, field, formId);
        case 'text-block':
            return fnCreateTextBlock(field.content, field, formId);
        default:
            console.warn('Unknown field type:', field.type);
            return null;
    }
}

// Create field element from legacy format
function fnCreateFieldByType(fieldName, fieldConfig, formId) {
    switch (fieldConfig.type) {
        case 'text':
            return fnCreateTextInput(fieldName, fieldConfig, formId);
        case 'textarea':
            return fnCreateTextarea(fieldName, fieldConfig, formId);
        case 'datetime':
            return fnCreateDatetime(fieldName, fieldConfig, formId);
        case 'image':
            return fnCreateImageUpload(fieldName, fieldConfig, formId);
        case 'text-block':
            return fnCreateTextBlock(fieldConfig.content, fieldConfig, formId);
        default:
            console.warn('Unknown field type:', fieldConfig.type);
            return null;
    }
}

// Get form data
function fnGetFormData(formId) {
    var formInstance = fnFormInstances[formId];
    if (!formInstance) {
        console.error('Form instance not found:', formId);
        return null;
    }
    
    var formElement = document.getElementById(formId);
    if (!formElement) {
        console.error('Form element not found:', formId);
        return null;
    }
    
    var data = {
        dateTimes: formInstance.dateTimes || [],
        images: formInstance.imageData || {}
    };
    
    // Get text inputs
    var textInputs = formElement.querySelectorAll('.fn-form-input');
    textInputs.forEach(function(input) {
        var label = formElement.querySelector(`label[for="${input.id}"]`);
        if (label) {
            var fieldName = label.textContent.replace(' *', '').trim();
            data[fieldName] = input.value;
        }
    });
    
    // Get textareas
    var textareas = formElement.querySelectorAll('.fn-form-textarea');
    textareas.forEach(function(textarea) {
        var label = formElement.querySelector(`label[for="${textarea.id}"]`);
        if (label) {
            var fieldName = label.textContent.replace(' *', '').trim();
            data[fieldName] = textarea.value;
        }
    });
    
    return data;
}

// Clear form data
function fnClearForm(formId) {
    var formInstance = fnFormInstances[formId];
    if (!formInstance) {
        console.error('Form instance not found:', formId);
        return;
    }
    
    var formElement = document.getElementById(formId);
    if (!formElement) {
        console.error('Form element not found:', formId);
        return;
    }
    
    // Clear text inputs
    var textInputs = formElement.querySelectorAll('.fn-form-input');
    textInputs.forEach(function(input) {
        input.value = '';
    });
    
    // Clear textareas
    var textareas = formElement.querySelectorAll('.fn-form-textarea');
    textareas.forEach(function(textarea) {
        textarea.value = '';
        // Update character counter
        var fieldId = textarea.id.replace('Textarea', '');
        var counter = document.getElementById(fieldId + 'Counter');
        if (counter) {
            var charLimit = textarea.maxLength || 500;
            counter.textContent = `0/${charLimit}`;
            counter.className = 'fn-char-counter';
        }
    });
    
    // Clear datetime events
    formInstance.dateTimes = [];
    var eventsLists = formElement.querySelectorAll('.fn-events-list');
    eventsLists.forEach(function(list) {
        list.innerHTML = '';
    });
    
    // Clear images
    formInstance.imageData = {};
    var imageContainers = formElement.querySelectorAll('.fn-image-upload-container');
    imageContainers.forEach(function(container) {
        if (container.classList.contains('fn-has-image')) {
            container.querySelector('.fn-remove-image-btn').click();
        }
    });
}

// Generic initialization function
function fnInitForm(container, formConfig, config, options) {
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
    
    // Create form
    var formId = options.formId || 'form_' + Math.random().toString(36).substr(2, 9);
    var form = fnCreateForm(formConfig, config, formId);
    
    // Add form to container
    container.appendChild(form);
    
    // Return form utilities
    return {
        formId: formId,
        element: form,
        getData: function() {
            return fnGetFormData(formId);
        },
        clearData: function() {
            fnClearForm(formId);
        },
        getInstance: function() {
            return fnFormInstances[formId];
        }
    };
}

// Export for use in other environments
if (typeof window !== 'undefined') {
    window.FnFormWidget = {
        createForm: fnCreateForm,
        initForm: fnInitForm,
        getFormData: fnGetFormData,
        clearForm: fnClearForm,
        defaultConfig: fnDefaultConfig,
        generateId: fnGenerateId,
        formatDateTime: fnFormatDateTime
    };
    
    // Legacy support
    window.getForm = fnCreateForm;
    window.formImageData = {};
    window.dateTimes = [];
}
