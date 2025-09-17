/**
 * Main application file
 * Coordinates all modules and initializes the app
 */

const App = {
    /**
     * Initialize the application
     */
    async init() {
        console.log('Task Tracker initializing...');
        
        try {
            // Initialize storage system (Firebase)
            await Storage.init();
            
            // Initialize UI components
            UI.init();
            
            // Initialize swipe functionality
            Swipe.init();
            
            // Initialize finance module
            Finance.init();
            
            // Initialize media module
            Media.init();
            
            // Set up real-time listeners for live updates
            this.setupRealtimeSync();
            
            // Set up error handling
            this.setupErrorHandling();
            
            // Set up service worker for offline functionality (optional)
            this.setupServiceWorker();
            
            console.log('Task Tracker initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            UI.showError('Failed to initialize application');
        }
    },

    /**
     * Set up global error handling
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            UI.showError('An unexpected error occurred');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            UI.showError('An unexpected error occurred');
            event.preventDefault();
        });
    },

    /**
     * Set up real-time synchronization
     */
    setupRealtimeSync() {
        Storage.setupRealtimeListeners(
            // On finances change
            (entries) => {
                console.log('Finances updated via real-time sync');
                UI.displayFinances(entries);
            },
            // On media change
            (entries) => {
                console.log('Media updated via real-time sync');
                UI.displayMedia(entries);
            }
        );
    },

    /**
     * Set up service worker for offline functionality
     */
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered:', registration);
                })
                .catch((error) => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    },

    /**
     * Get app statistics (for future dashboard)
     * @returns {Promise<Object>} - Combined statistics
     */
    async getAppStatistics() {
        try {
            const [financeStats, mediaStats] = await Promise.all([
                Finance.getStatistics(),
                Media.getStatistics()
            ]);

            return {
                finance: financeStats,
                media: mediaStats,
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Failed to get app statistics:', error);
            return null;
        }
    },

    /**
     * Export all data (for backup purposes)
     * @returns {Promise<Object>} - All app data
     */
    async exportData() {
        try {
            UI.showLoading(true);
            
            const [finances, media] = await Promise.all([
                Storage.getFinances(),
                Storage.getMedia()
            ]);

            const exportData = {
                finances,
                media,
                exportDate: new Date().toISOString(),
                version: '1.0.0'
            };

            // Create downloadable file
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `task-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            UI.showSuccess('Data exported successfully');
            
        } catch (error) {
            UI.showError('Failed to export data');
        } finally {
            UI.showLoading(false);
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for global access
window.App = App;

