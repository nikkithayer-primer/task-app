/**
 * Configuration file for the Task Tracker app
 * Contains API endpoints and app settings
 */

const Config = {
    // Firebase Configuration
    // You'll get these values from Firebase Console after creating your project
    FIREBASE: {
        apiKey: "AIzaSyBblibC6rilmjCgGtMATmed9kTYUQjhoZQ",
        authDomain: "finance-media-tracker.firebaseapp.com",
        projectId: "finance-media-tracker",
        storageBucket: "finance-media-tracker.firebasestorage.app",
        messagingSenderId: "70447292384",
        appId: "1:70447292384:web:4e12561236ae6c9bcc9585"
    },
    
    // Firestore Collections
    COLLECTIONS: {
        FINANCES: 'finances',
        MEDIA: 'media'
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

