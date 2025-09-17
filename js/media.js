/**
 * Media module for handling media consumption logging
 * Manages media form, validation, and display
 */

const Media = {
    /**
     * Initialize media functionality
     */
    init() {
        this.bindEvents();
        this.loadEntries();
    },

    /**
     * Bind event listeners for media form
     */
    bindEvents() {
        const form = document.getElementById('media-form');
        const worthBtn = document.getElementById('media-worth');

        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        if (worthBtn) {
            worthBtn.addEventListener('click', (e) => this.toggleWorth(e));
        }
    },

    /**
     * Handle form submission
     * @param {Event} e - Form submit event
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = this.getFormData();
        
        if (!this.validateFormData(formData)) {
            return;
        }

        try {
            UI.showLoading(true);
            
            const entry = {
                description: formData.description,
                worthIt: formData.worthIt
            };

            await Storage.addMedia(entry);
            
            UI.clearForm('media-form');
            this.loadEntries();
            UI.showSuccess('Media entry added successfully!');
            
        } catch (error) {
            UI.showError('Failed to add media entry');
        } finally {
            UI.showLoading(false);
        }
    },

    /**
     * Get form data
     * @returns {Object} - Form data object
     */
    getFormData() {
        return {
            description: document.getElementById('media-description').value.trim(),
            worthIt: document.getElementById('media-worth').dataset.worth === 'true'
        };
    },

    /**
     * Validate form data
     * @param {Object} data - Form data to validate
     * @returns {boolean} - Whether data is valid
     */
    validateFormData(data) {
        if (!data.description) {
            UI.showError('Please enter what you watched');
            return false;
        }

        return true;
    },

    /**
     * Toggle worth it button
     * @param {Event} e - Click event
     */
    toggleWorth(e) {
        const button = e.target;
        const isWorthIt = button.dataset.worth === 'true';
        
        if (isWorthIt) {
            button.dataset.worth = 'false';
            button.textContent = '👎';
        } else {
            button.dataset.worth = 'true';
            button.textContent = '👍';
        }
    },

    /**
     * Load and display media entries
     */
    async loadEntries() {
        try {
            const entries = await Storage.getMedia();
            // Sort by timestamp, newest first
            entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            UI.displayMedia(entries);
        } catch (error) {
            UI.showError('Failed to load media entries');
        }
    },

    /**
     * Get media statistics (for future analytics)
     * @returns {Promise<Object>} - Statistics object
     */
    async getStatistics() {
        try {
            const entries = await Storage.getMedia();
            
            if (entries.length === 0) {
                return {
                    total: 0,
                    worthItCount: 0,
                    notWorthItCount: 0,
                    worthItPercentage: 0
                };
            }

            const stats = entries.reduce((acc, entry) => {
                if (entry.worthIt) {
                    acc.worthItCount++;
                } else {
                    acc.notWorthItCount++;
                }
                return acc;
            }, {
                worthItCount: 0,
                notWorthItCount: 0
            });

            stats.total = entries.length;
            stats.worthItPercentage = (stats.worthItCount / stats.total) * 100;

            return stats;
        } catch (error) {
            console.error('Failed to get statistics:', error);
            return null;
        }
    },

    /**
     * Search media entries (for future enhancement)
     * @param {string} query - Search query
     * @returns {Promise<Array>} - Matching entries
     */
    async searchMedia(query) {
        try {
            const entries = await Storage.getMedia();
            const searchTerm = query.toLowerCase();

            return entries.filter(entry => 
                entry.description.toLowerCase().includes(searchTerm)
            );
        } catch (error) {
            console.error('Failed to search media:', error);
            return [];
        }
    }
};

// Export for global access
window.Media = Media;

