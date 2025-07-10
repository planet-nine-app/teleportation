/**
 * allyabase-tauri.js
 * Tauri environment implementation of allyabase object
 * Uses Tauri's invoke API to call Rust backend for persistence
 */

const allyabase = {
    /**
     * Save a Business Data Object (BDO) using Tauri backend
     * @param {Object} data - The data object to save
     * @returns {Promise<string>} - Promise resolving to success message
     */
    saveBDO: async function(data) {
        console.log('🦀 allyabase-tauri: saveBDO called with:', data);
        
        try {
            // Check if Tauri environment is available
            if (!window.__TAURI__) {
                throw new Error('Tauri environment not available');
            }
            
            // For now, just a no-op that logs the data
            // Future implementation will use:
            // const { invoke } = window.__TAURI__.tauri;
            // const result = await invoke('save_config', { config: data });
            
            console.log('🦀 Tauri saveBDO - No-op implementation');
            console.log('📝 Data that would be saved to Rust backend:', JSON.stringify(data, null, 2));
            
            // Simulate the Tauri invoke call
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve('Tauri save operation completed (no-op)');
                }, 150);
            });
            
        } catch (error) {
            console.error('❌ Error in Tauri saveBDO:', error);
            throw error;
        }
    },

    /**
     * Get/Load a Business Data Object (BDO) using Tauri backend
     * @returns {Promise<Object|null>} - Promise resolving to the loaded data object or null
     */
    getBDO: async function() {
        console.log('🦀 allyabase-tauri: getBDO called');
        
        try {
            // Check if Tauri environment is available
            if (!window.__TAURI__) {
                throw new Error('Tauri environment not available');
            }
            
            // For now, just a no-op that returns null (no saved data)
            // Future implementation will use:
            // const { invoke } = window.__TAURI__.tauri;
            // const result = await invoke('load_config');
            // return result;
            
            console.log('🦀 Tauri getBDO - No-op implementation');
            console.log('📄 No saved data found (no-op)');
            
            // Simulate the Tauri invoke call that finds no data
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(null); // No saved data
                }, 100);
            });
            
        } catch (error) {
            console.error('❌ Error in Tauri getBDO:', error);
            throw error;
        }
    },

    /**
     * Check if the Tauri environment supports the required features
     * @returns {boolean} - True if environment is supported
     */
    isSupported: function() {
        const hasTauri = typeof window.__TAURI__ !== 'undefined';
        const hasInvoke = hasTauri && typeof window.__TAURI__.tauri?.invoke === 'function';
        
        console.log('🦀 Tauri environment support check:', {
            tauri: hasTauri,
            invoke: hasInvoke
        });
        
        return hasTauri && hasInvoke;
    },

    /**
     * Get information about the current Tauri environment
     * @returns {Promise<Object>} - Environment info promise
     */
    getEnvironmentInfo: async function() {
        const baseInfo = {
            type: 'tauri',
            hasTauri: typeof window.__TAURI__ !== 'undefined'
        };

        if (!baseInfo.hasTauri) {
            return baseInfo;
        }

        try {
            // Future: Could call Tauri commands to get more info
            // const { invoke } = window.__TAURI__.tauri;
            // const configPath = await invoke('get_config_path');
            
            return {
                ...baseInfo,
                platform: 'unknown', // Future: await window.__TAURI__.os.platform()
                configPath: 'not-implemented', // Future: actual path
                version: 'unknown' // Future: app version
            };
        } catch (error) {
            console.warn('🦀 Could not get complete Tauri environment info:', error);
            return baseInfo;
        }
    },

    /**
     * Initialize the Tauri allyabase
     * @returns {Promise<void>} - Initialization promise
     */
    initialize: async function() {
        console.log('🦀 Initializing Tauri allyabase...');
        
        if (!this.isSupported()) {
            throw new Error('Tauri environment not supported');
        }
        
        try {
            // Future: Could call initialization commands
            // const { invoke } = window.__TAURI__.tauri;
            // await invoke('initialize_config_system');
            
            console.log('✅ Tauri allyabase initialized');
            return Promise.resolve();
        } catch (error) {
            console.error('❌ Failed to initialize Tauri allyabase:', error);
            throw error;
        }
    },

    /**
     * Get the config file path (Tauri-specific method)
     * @returns {Promise<string>} - Path to config file
     */
    getConfigPath: async function() {
        if (!this.isSupported()) {
            throw new Error('Tauri environment not supported');
        }
        
        try {
            // Future implementation:
            // const { invoke } = window.__TAURI__.tauri;
            // return await invoke('get_config_path');
            
            console.log('🦀 getConfigPath - No-op implementation');
            return Promise.resolve('/path/to/config/file.json (no-op)');
        } catch (error) {
            console.error('❌ Error getting config path:', error);
            throw error;
        }
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.allyabase = allyabase;
    console.log('🦀 allyabase-tauri loaded and attached to window');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = allyabase;
}

// Also support ES6 modules
if (typeof exports !== 'undefined') {
    exports.allyabase = allyabase;
}
