/**
 * Storage module for handling localStorage operations
 * This module provides a centralized way to manage data persistence
 */

const Storage = {
    // Keys for localStorage
    FINANCE_KEY: 'taskTracker_finances',
    MEDIA_KEY: 'taskTracker_media',

    /**
     * Get data from localStorage
     * @param {string} key - The storage key
     * @returns {Array} - Array of stored items or empty array if none exist
     */
    getData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error retrieving data from localStorage:', error);
            return [];
        }
    },

    /**
     * Save data to localStorage
     * @param {string} key - The storage key
     * @param {Array} data - Array of items to store
     */
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    },

    /**
     * Add a new item to storage
     * @param {string} key - The storage key
     * @param {Object} item - The item to add
     */
    addItem(key, item) {
        const data = this.getData(key);
        const itemWithId = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            ...item
        };
        data.unshift(itemWithId); // Add to beginning for recent-first display
        this.saveData(key, data);
        return itemWithId;
    },

    /**
     * Remove an item from storage
     * @param {string} key - The storage key
     * @param {string} id - The ID of the item to remove
     */
    removeItem(key, id) {
        const data = this.getData(key);
        const filteredData = data.filter(item => item.id !== id);
        this.saveData(key, filteredData);
    },

    /**
     * Generate a unique ID for items
     * @returns {string} - Unique identifier
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Get finance data
     * @returns {Array} - Array of finance entries
     */
    getFinances() {
        return this.getData(this.FINANCE_KEY);
    },

    /**
     * Save finance entry
     * @param {Object} entry - Finance entry object
     */
    addFinance(entry) {
        return this.addItem(this.FINANCE_KEY, entry);
    },

    /**
     * Remove finance entry
     * @param {string} id - ID of the entry to remove
     */
    removeFinance(id) {
        this.removeItem(this.FINANCE_KEY, id);
    },

    /**
     * Get media data
     * @returns {Array} - Array of media entries
     */
    getMedia() {
        return this.getData(this.MEDIA_KEY);
    },

    /**
     * Save media entry
     * @param {Object} entry - Media entry object
     */
    addMedia(entry) {
        return this.addItem(this.MEDIA_KEY, entry);
    },

    /**
     * Remove media entry
     * @param {string} id - ID of the entry to remove
     */
    removeMedia(id) {
        this.removeItem(this.MEDIA_KEY, id);
    },

    /**
     * Clear all data (useful for testing or reset functionality)
     */
    clearAll() {
        localStorage.removeItem(this.FINANCE_KEY);
        localStorage.removeItem(this.MEDIA_KEY);
    }
};
