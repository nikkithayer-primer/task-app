/**
 * Configuration file for the Task Tracker app
 * Contains API endpoints and app settings
 */

const Config = {
    // GitHub Configuration
    GITHUB: {
        OWNER: 'nikkithayer-primer', // Replace with your GitHub username
        REPO: 'task-app', // Replace with your repository name
        BRANCH: 'main', // or 'master' depending on your default branch
        DATA_PATH: 'data', // folder in repo to store data files
        FILES: {
            FINANCES: 'finances.json',
            MEDIA: 'media.json'
        }
    },
    
    // GitHub API
    GITHUB_API_BASE: 'https://api.github.com',
    
    // App Settings
    SWIPE_THRESHOLD: 100, // pixels to swipe before delete
    SWIPE_TIME_LIMIT: 1000, // max time for swipe gesture (ms)
    
    // Date formatting
    DATE_FORMAT: 'DD/MM/YY',
    
    // Storage keys (fallback for local storage)
    STORAGE_KEYS: {
        FINANCES: 'task_tracker_finances',
        MEDIA: 'task_tracker_media'
    },
    
    // GitHub Personal Access Token (set this in browser localStorage)
    // Instructions: Create token at https://github.com/settings/tokens
    // Required scopes: repo (for private repos) or public_repo (for public repos)
    getGitHubToken() {
        return localStorage.getItem('github_token');
    },
    
    setGitHubToken(token) {
        localStorage.setItem('github_token', token);
    }
};

// Export for other modules
window.Config = Config;

