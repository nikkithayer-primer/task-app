/**
 * Media module for handling media consumption logging
 * This module manages the media form, validation, and display
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
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Bind worth-it button event
        const worthItBtn = document.getElementById('media-worth-it');
        if (worthItBtn) {
            worthItBtn.addEventListener('click', (e) => this.handleWorthItToggle(e));
        }

        // Bind delete button events (delegated event handling)
        const logContainer = document.getElementById('media-log');
        if (logContainer) {
            logContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-btn')) {
                    this.handleDelete(e);
                }
            });
        }
    },

    /**
     * Handle form submission
     * @param {Event} e - Form submit event
     */
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = this.getFormData();
        
        if (this.validateFormData(formData)) {
            const entry = {
                description: formData.description,
                worthIt: formData.worthIt
            };

            // Save to storage
            const savedEntry = Storage.addMedia(entry);
            
            // Update display
            this.loadEntries();
            
            // Clear form
            UI.clearForm('media-form');
            
            // Show success message
            const submitBtn = document.querySelector('#media-form .submit-btn');
            UI.showSuccessMessage('Media log added successfully!', submitBtn);
        }
    },

    /**
     * Handle worth-it button toggle
     * @param {Event} e - Click event
     */
    handleWorthItToggle(e) {
        const button = e.target;
        const isWorthIt = button.getAttribute('data-worth') === 'true';
        
        if (isWorthIt) {
            button.setAttribute('data-worth', 'false');
            button.textContent = 'Not worth it';
        } else {
            button.setAttribute('data-worth', 'true');
            button.textContent = 'Worth it';
        }
    },

    /**
     * Get form data
     * @returns {Object} - Form data object
     */
    getFormData() {
        return {
            description: document.getElementById('media-description').value.trim(),
            worthIt: document.getElementById('media-worth-it').getAttribute('data-worth') === 'true'
        };
    },

    /**
     * Validate form data
     * @param {Object} data - Form data to validate
     * @returns {boolean} - Whether data is valid
     */
    validateFormData(data) {
        if (!data.description) {
            this.showError('Please enter what you watched');
            return false;
        }

        return true;
    },

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        // Create or update error message
        let errorDiv = document.querySelector('.media-error');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'media-error';
            errorDiv.style.cssText = `
                background: #dc3545;
                color: white;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 15px;
                font-size: 14px;
            `;
            
            const form = document.getElementById('media-form');
            form.insertBefore(errorDiv, form.firstChild);
        }

        errorDiv.textContent = message;

        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    },

    /**
     * Handle delete button click
     * @param {Event} e - Click event
     */
    handleDelete(e) {
        const entryElement = e.target.closest('.log-entry');
        const entryId = entryElement.getAttribute('data-id');
        
        if (confirm('Are you sure you want to delete this media log?')) {
            Storage.removeMedia(entryId);
            this.loadEntries();
        }
    },

    /**
     * Load and display media entries
     */
    loadEntries() {
        const entries = Storage.getMedia();
        UI.displayEntries(entries, 'media-log', 'media');
    },

    /**
     * Get media statistics (for future analytics)
     * @returns {Object} - Statistics object
     */
    getStatistics() {
        const entries = Storage.getMedia();
        
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
    },

    /**
     * Get media by time period (for future analytics)
     * @param {number} days - Number of days to look back
     * @returns {Array} - Filtered entries
     */
    getRecentMedia(days = 7) {
        const entries = Storage.getMedia();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return entries.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            return entryDate >= cutoffDate;
        });
    },

    /**
     * Search media entries (for future enhancement)
     * @param {string} query - Search query
     * @returns {Array} - Matching entries
     */
    searchMedia(query) {
        const entries = Storage.getMedia();
        const searchTerm = query.toLowerCase();

        return entries.filter(entry => 
            entry.description.toLowerCase().includes(searchTerm)
        );
    },

    /**
     * Export media data (for future enhancement)
     * @returns {string} - CSV formatted data
     */
    exportData() {
        const entries = Storage.getMedia();
        
        if (entries.length === 0) {
            return 'No data to export';
        }

        const headers = ['Date', 'Description', 'Worth It'];
        const csvData = [headers.join(',')];

        entries.forEach(entry => {
            const row = [
                new Date(entry.timestamp).toLocaleDateString(),
                `"${entry.description}"`,
                entry.worthIt ? 'Yes' : 'No'
            ];
            csvData.push(row.join(','));
        });

        return csvData.join('\n');
    },

    /**
     * Get media consumption trends (for future analytics)
     * @returns {Object} - Trend data
     */
    getTrends() {
        const entries = Storage.getMedia();
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        
        const recentEntries = entries.filter(entry => 
            new Date(entry.timestamp) >= thirtyDaysAgo
        );

        // Group by day
        const dailyCount = {};
        recentEntries.forEach(entry => {
            const date = new Date(entry.timestamp).toDateString();
            dailyCount[date] = (dailyCount[date] || 0) + 1;
        });

        return {
            totalLast30Days: recentEntries.length,
            averagePerDay: recentEntries.length / 30,
            dailyBreakdown: dailyCount,
            worthItRatio: recentEntries.length > 0 ? 
                (recentEntries.filter(e => e.worthIt).length / recentEntries.length) * 100 : 0
        };
    }
};
