/**
 * Configuration file for the Task Tracker app
 * Contains API endpoints and app settings
 */

const Config = {
    // API Configuration
    API_BASE_URL: 'https://jsonplaceholder.typicode.com', // Replace with your actual API
    ENDPOINTS: {
        FINANCES: '/finances',
        MEDIA: '/media'
    },
    
    // App Settings
    SWIPE_THRESHOLD: 100, // pixels to swipe before delete
    SWIPE_TIME_LIMIT: 1000, // max time for swipe gesture (ms)
    
    // Date formatting
    DATE_FORMAT: 'DD/MM/YY',
    
    // Storage keys (fallback for local storage)
    STORAGE_KEYS: {
        FINANCES: 'task_tracker_finances',
        MEDIA: 'task_tracker_media'
    }
};

// Export for other modules
window.Config = Config;

