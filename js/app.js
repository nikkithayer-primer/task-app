/**
 * Main application file
 * This file initializes all modules and handles global app functionality
 */

const App = {
    /**
     * Initialize the application
     */
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    },

    /**
     * Start the application
     */
    start() {
        console.log('Task Tracker App starting...');
        
        try {
            // Initialize all modules
            UI.init();
            Swipe.init();
            Finance.init();
            Media.init();
            
            // Add CSS animation for success messages
            this.addGlobalStyles();
            
            console.log('Task Tracker App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showErrorMessage('Failed to initialize the application. Please refresh the page.');
        }
    },

    /**
     * Add global CSS styles dynamically
     */
    addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-10px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-10px); }
            }
            
            .delete-btn:hover {
                background-color: #dc3545 !important;
                color: white !important;
                border-radius: 3px !important;
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Show global error message
     * @param {string} message - Error message to display
     */
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 9999;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    },

    /**
     * Get application statistics (for future dashboard)
     * @returns {Object} - Combined statistics
     */
    getAppStatistics() {
        return {
            finance: Finance.getStatistics(),
            media: Media.getStatistics(),
            lastUpdated: new Date().toISOString()
        };
    },

    /**
     * Export all data (for future enhancement)
     * @returns {Object} - All app data
     */
    exportAllData() {
        return {
            finances: Storage.getFinances(),
            media: Storage.getMedia(),
            exportDate: new Date().toISOString()
        };
    },

    /**
     * Import data (for future enhancement)
     * @param {Object} data - Data to import
     */
    importData(data) {
        try {
            if (data.finances && Array.isArray(data.finances)) {
                Storage.saveData(Storage.FINANCE_KEY, data.finances);
                Finance.loadEntries();
            }
            
            if (data.media && Array.isArray(data.media)) {
                Storage.saveData(Storage.MEDIA_KEY, data.media);
                Media.loadEntries();
            }
            
            console.log('Data imported successfully');
        } catch (error) {
            console.error('Error importing data:', error);
            this.showErrorMessage('Failed to import data');
        }
    },

    /**
     * Clear all application data
     */
    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            Storage.clearAll();
            Finance.loadEntries();
            Media.loadEntries();
            console.log('All data cleared');
        }
    }
};

// Initialize the app
App.init();
