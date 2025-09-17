/**
 * Storage module for handling data persistence via GitHub API
 * Uses GitHub repository as a database with JSON files
 */

const Storage = {
    /**
     * Initialize storage system
     */
    init() {
        console.log('GitHub storage system initialized');
        this.checkGitHubAuth();
    },

    /**
     * Check if GitHub token is available
     */
    checkGitHubAuth() {
        const token = Config.getGitHubToken();
        if (!token) {
            console.warn('No GitHub token found. Data will only be stored locally.');
            console.log('To enable syncing, set a GitHub token: Config.setGitHubToken("your_token")');
        }
    },

    /**
     * Generic GitHub API request handler
     * @param {string} endpoint - GitHub API endpoint
     * @param {Object} options - Request options
     * @returns {Promise} - Response data
     */
    async githubRequest(endpoint, options = {}) {
        const token = Config.getGitHubToken();
        if (!token) {
            throw new Error('No GitHub token available');
        }

        const url = `${Config.GITHUB_API_BASE}${endpoint}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`GitHub API error: ${response.status} - ${errorData.message || response.statusText}`);
        }

        return await response.json();
    },

    /**
     * Get file content from GitHub
     * @param {string} filename - Name of file to get
     * @returns {Promise<Object>} - File data and metadata
     */
    async getGitHubFile(filename) {
        const path = `${Config.GITHUB.DATA_PATH}/${filename}`;
        const endpoint = `/repos/${Config.GITHUB.OWNER}/${Config.GITHUB.REPO}/contents/${path}`;
        
        try {
            const fileData = await this.githubRequest(endpoint);
            const content = JSON.parse(atob(fileData.content));
            return {
                data: content,
                sha: fileData.sha
            };
        } catch (error) {
            if (error.message.includes('404')) {
                // File doesn't exist yet
                return {
                    data: [],
                    sha: null
                };
            }
            throw error;
        }
    },

    /**
     * Save file content to GitHub
     * @param {string} filename - Name of file to save
     * @param {Array} data - Data to save
     * @param {string} sha - Current file SHA (for updates)
     * @returns {Promise<Object>} - Updated file info
     */
    async saveGitHubFile(filename, data, sha = null) {
        const path = `${Config.GITHUB.DATA_PATH}/${filename}`;
        const endpoint = `/repos/${Config.GITHUB.OWNER}/${Config.GITHUB.REPO}/contents/${path}`;
        
        const content = btoa(JSON.stringify(data, null, 2));
        const message = `Update ${filename} - ${new Date().toISOString()}`;

        const body = {
            message,
            content,
            branch: Config.GITHUB.BRANCH
        };

        if (sha) {
            body.sha = sha;
        }

        return await this.githubRequest(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    /**
     * Add a finance entry
     * @param {Object} entry - Finance entry data
     * @returns {Promise<Object>} - Saved entry with ID
     */
    async addFinance(entry) {
        const entryWithTimestamp = {
            ...entry,
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            type: 'finance'
        };

        try {
            // Try GitHub first
            const fileData = await this.getGitHubFile(Config.GITHUB.FILES.FINANCES);
            const entries = fileData.data;
            entries.push(entryWithTimestamp);
            
            await this.saveGitHubFile(Config.GITHUB.FILES.FINANCES, entries, fileData.sha);
            
            // Also save to localStorage as backup
            this.saveToLocalStorage('finances', entryWithTimestamp);
            
            return entryWithTimestamp;
        } catch (error) {
            console.warn('GitHub save failed, using localStorage:', error);
            return this.saveToLocalStorage('finances', entryWithTimestamp);
        }
    },

    /**
     * Add a media entry
     * @param {Object} entry - Media entry data
     * @returns {Promise<Object>} - Saved entry with ID
     */
    async addMedia(entry) {
        const entryWithTimestamp = {
            ...entry,
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            type: 'media'
        };

        try {
            // Try GitHub first
            const fileData = await this.getGitHubFile(Config.GITHUB.FILES.MEDIA);
            const entries = fileData.data;
            entries.push(entryWithTimestamp);
            
            await this.saveGitHubFile(Config.GITHUB.FILES.MEDIA, entries, fileData.sha);
            
            // Also save to localStorage as backup
            this.saveToLocalStorage('media', entryWithTimestamp);
            
            return entryWithTimestamp;
        } catch (error) {
            console.warn('GitHub save failed, using localStorage:', error);
            return this.saveToLocalStorage('media', entryWithTimestamp);
        }
    },

    /**
     * Get all finance entries
     * @returns {Promise<Array>} - Array of finance entries
     */
    async getFinances() {
        try {
            // Try GitHub first
            const fileData = await this.getGitHubFile(Config.GITHUB.FILES.FINANCES);
            return fileData.data || [];
        } catch (error) {
            console.warn('GitHub read failed, using localStorage:', error);
            return this.getFromLocalStorage('finances');
        }
    },

    /**
     * Get all media entries
     * @returns {Promise<Array>} - Array of media entries
     */
    async getMedia() {
        try {
            // Try GitHub first
            const fileData = await this.getGitHubFile(Config.GITHUB.FILES.MEDIA);
            return fileData.data || [];
        } catch (error) {
            console.warn('GitHub read failed, using localStorage:', error);
            return this.getFromLocalStorage('media');
        }
    },

    /**
     * Delete a finance entry
     * @param {string} id - Entry ID
     * @returns {Promise<boolean>} - Success status
     */
    async deleteFinance(id) {
        try {
            // Try GitHub first
            const fileData = await this.getGitHubFile(Config.GITHUB.FILES.FINANCES);
            const entries = fileData.data.filter(entry => entry.id !== id);
            
            await this.saveGitHubFile(Config.GITHUB.FILES.FINANCES, entries, fileData.sha);
            
            // Also update localStorage
            this.deleteFromLocalStorage('finances', id);
            
            return true;
        } catch (error) {
            console.warn('GitHub delete failed, using localStorage:', error);
            return this.deleteFromLocalStorage('finances', id);
        }
    },

    /**
     * Delete a media entry
     * @param {string} id - Entry ID
     * @returns {Promise<boolean>} - Success status
     */
    async deleteMedia(id) {
        try {
            // Try GitHub first
            const fileData = await this.getGitHubFile(Config.GITHUB.FILES.MEDIA);
            const entries = fileData.data.filter(entry => entry.id !== id);
            
            await this.saveGitHubFile(Config.GITHUB.FILES.MEDIA, entries, fileData.sha);
            
            // Also update localStorage
            this.deleteFromLocalStorage('media', id);
            
            return true;
        } catch (error) {
            console.warn('GitHub delete failed, using localStorage:', error);
            return this.deleteFromLocalStorage('media', id);
        }
    },

    /**
     * Update a finance entry
     * @param {string} id - Entry ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<Object>} - Updated entry
     */
    async updateFinance(id, updates) {
        try {
            // Try GitHub first
            const fileData = await this.getGitHubFile(Config.GITHUB.FILES.FINANCES);
            const entries = fileData.data;
            const entryIndex = entries.findIndex(entry => entry.id === id);
            
            if (entryIndex === -1) {
                throw new Error('Entry not found');
            }

            entries[entryIndex] = { ...entries[entryIndex], ...updates };
            
            await this.saveGitHubFile(Config.GITHUB.FILES.FINANCES, entries, fileData.sha);
            
            // Also update localStorage
            this.updateInLocalStorage('finances', id, updates);
            
            return entries[entryIndex];
        } catch (error) {
            console.warn('GitHub update failed, using localStorage:', error);
            return this.updateInLocalStorage('finances', id, updates);
        }
    },

    /**
     * Update a media entry
     * @param {string} id - Entry ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<Object>} - Updated entry
     */
    async updateMedia(id, updates) {
        try {
            // Try GitHub first
            const fileData = await this.getGitHubFile(Config.GITHUB.FILES.MEDIA);
            const entries = fileData.data;
            const entryIndex = entries.findIndex(entry => entry.id === id);
            
            if (entryIndex === -1) {
                throw new Error('Entry not found');
            }

            entries[entryIndex] = { ...entries[entryIndex], ...updates };
            
            await this.saveGitHubFile(Config.GITHUB.FILES.MEDIA, entries, fileData.sha);
            
            // Also update localStorage
            this.updateInLocalStorage('media', id, updates);
            
            return entries[entryIndex];
        } catch (error) {
            console.warn('GitHub update failed, using localStorage:', error);
            return this.updateInLocalStorage('media', id, updates);
        }
    },

    /**
     * Save to local storage (fallback)
     * @param {string} type - Data type (finances/media)
     * @param {Object} entry - Entry to save
     * @returns {Object} - Saved entry
     */
    saveToLocalStorage(type, entry) {
        const key = Config.STORAGE_KEYS[type.toUpperCase()];
        const existing = this.getFromLocalStorage(type);
        existing.push(entry);
        localStorage.setItem(key, JSON.stringify(existing));
        return entry;
    },

    /**
     * Get from local storage (fallback)
     * @param {string} type - Data type (finances/media)
     * @returns {Array} - Array of entries
     */
    getFromLocalStorage(type) {
        const key = Config.STORAGE_KEYS[type.toUpperCase()];
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Delete from local storage (fallback)
     * @param {string} type - Data type (finances/media)
     * @param {string} id - Entry ID to delete
     * @returns {boolean} - Success status
     */
    deleteFromLocalStorage(type, id) {
        const key = Config.STORAGE_KEYS[type.toUpperCase()];
        const existing = this.getFromLocalStorage(type);
        const filtered = existing.filter(entry => entry.id !== id);
        localStorage.setItem(key, JSON.stringify(filtered));
        return true;
    },

    /**
     * Update entry in local storage (fallback)
     * @param {string} type - Data type (finances/media)
     * @param {string} id - Entry ID to update
     * @param {Object} updates - Fields to update
     * @returns {Object} - Updated entry
     */
    updateInLocalStorage(type, id, updates) {
        const key = Config.STORAGE_KEYS[type.toUpperCase()];
        const existing = this.getFromLocalStorage(type);
        const entryIndex = existing.findIndex(entry => entry.id === id);
        
        if (entryIndex === -1) {
            throw new Error('Entry not found');
        }

        existing[entryIndex] = { ...existing[entryIndex], ...updates };
        localStorage.setItem(key, JSON.stringify(existing));
        
        return existing[entryIndex];
    },

    /**
     * Generate a unique ID
     * @returns {string} - Unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Sync localStorage data to GitHub (useful for initial setup)
     * @returns {Promise<Object>} - Sync results
     */
    async syncLocalToGitHub() {
        try {
            const localFinances = this.getFromLocalStorage('finances');
            const localMedia = this.getFromLocalStorage('media');

            const results = {
                finances: { synced: 0, errors: 0 },
                media: { synced: 0, errors: 0 }
            };

            if (localFinances.length > 0) {
                try {
                    await this.saveGitHubFile(Config.GITHUB.FILES.FINANCES, localFinances);
                    results.finances.synced = localFinances.length;
                } catch (error) {
                    results.finances.errors = 1;
                    console.error('Failed to sync finances:', error);
                }
            }

            if (localMedia.length > 0) {
                try {
                    await this.saveGitHubFile(Config.GITHUB.FILES.MEDIA, localMedia);
                    results.media.synced = localMedia.length;
                } catch (error) {
                    results.media.errors = 1;
                    console.error('Failed to sync media:', error);
                }
            }

            return results;
        } catch (error) {
            console.error('Sync failed:', error);
            throw error;
        }
    }
};