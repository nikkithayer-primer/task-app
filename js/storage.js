/**
 * Storage module for handling data persistence
 * Handles both server-side API calls and local storage fallback
 */

const Storage = {
    /**
     * Initialize storage system
     */
    init() {
        console.log('Storage system initialized');
    },

    /**
     * Generic API request handler
     * @param {string} url - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise} - Response data
     */
    async apiRequest(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.warn('API request failed, falling back to local storage:', error);
            throw error;
        }
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
            // Try API first
            const response = await this.apiRequest(`${Config.API_BASE_URL}${Config.ENDPOINTS.FINANCES}`, {
                method: 'POST',
                body: JSON.stringify(entryWithTimestamp)
            });
            return response;
        } catch (error) {
            // Fallback to local storage
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
            // Try API first
            const response = await this.apiRequest(`${Config.API_BASE_URL}${Config.ENDPOINTS.MEDIA}`, {
                method: 'POST',
                body: JSON.stringify(entryWithTimestamp)
            });
            return response;
        } catch (error) {
            // Fallback to local storage
            return this.saveToLocalStorage('media', entryWithTimestamp);
        }
    },

    /**
     * Get all finance entries
     * @returns {Promise<Array>} - Array of finance entries
     */
    async getFinances() {
        try {
            // Try API first
            const response = await this.apiRequest(`${Config.API_BASE_URL}${Config.ENDPOINTS.FINANCES}`);
            return response || [];
        } catch (error) {
            // Fallback to local storage
            return this.getFromLocalStorage('finances');
        }
    },

    /**
     * Get all media entries
     * @returns {Promise<Array>} - Array of media entries
     */
    async getMedia() {
        try {
            // Try API first
            const response = await this.apiRequest(`${Config.API_BASE_URL}${Config.ENDPOINTS.MEDIA}`);
            return response || [];
        } catch (error) {
            // Fallback to local storage
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
            // Try API first
            await this.apiRequest(`${Config.API_BASE_URL}${Config.ENDPOINTS.FINANCES}/${id}`, {
                method: 'DELETE'
            });
            return true;
        } catch (error) {
            // Fallback to local storage
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
            // Try API first
            await this.apiRequest(`${Config.API_BASE_URL}${Config.ENDPOINTS.MEDIA}/${id}`, {
                method: 'DELETE'
            });
            return true;
        } catch (error) {
            // Fallback to local storage
            return this.deleteFromLocalStorage('media', id);
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
     * Update a finance entry
     * @param {string} id - Entry ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<Object>} - Updated entry
     */
    async updateFinance(id, updates) {
        try {
            // Try API first (would be a PATCH request in real implementation)
            const response = await this.apiRequest(`${Config.API_BASE_URL}${Config.ENDPOINTS.FINANCES}/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(updates)
            });
            return response;
        } catch (error) {
            // Fallback to local storage
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
            // Try API first (would be a PATCH request in real implementation)
            const response = await this.apiRequest(`${Config.API_BASE_URL}${Config.ENDPOINTS.MEDIA}/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(updates)
            });
            return response;
        } catch (error) {
            // Fallback to local storage
            return this.updateInLocalStorage('media', id, updates);
        }
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

        // Update the entry
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
    }
};

