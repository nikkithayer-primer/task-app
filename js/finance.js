/**
 * Finance module for handling financial transaction logging
 * Manages finance form, validation, and display
 */

const Finance = {
    /**
     * Initialize finance functionality
     */
    init() {
        this.bindEvents();
        // Note: loadEntries() is handled by Firebase real-time listeners in app.js
    },

    /**
     * Bind event listeners for finance form
     */
    bindEvents() {
        const form = document.getElementById('finances-form');
        const worthBtn = document.getElementById('finance-worth');

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
                cost: parseFloat(formData.cost),
                worthIt: formData.worthIt
            };

            await Storage.addFinance(entry);
            
            UI.clearForm('finances-form');
            UI.showSuccess('Finance entry added successfully!');
            // Note: UI will update automatically via Firebase real-time listeners
            
        } catch (error) {
            UI.showError('Failed to add finance entry');
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
            description: document.getElementById('finance-description').value.trim(),
            cost: document.getElementById('finance-cost').value,
            worthIt: document.getElementById('finance-worth').dataset.worth === 'true'
        };
    },

    /**
     * Validate form data
     * @param {Object} data - Form data to validate
     * @returns {boolean} - Whether data is valid
     */
    validateFormData(data) {
        if (!data.description) {
            UI.showError('Please enter a description');
            return false;
        }

        if (!data.cost || isNaN(parseFloat(data.cost)) || parseFloat(data.cost) <= 0) {
            UI.showError('Please enter a valid cost greater than 0');
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
     * Load and display finance entries
     */
    async loadEntries() {
        try {
            const entries = await Storage.getFinances();
            // Sort by timestamp, newest first
            entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            UI.displayFinances(entries);
        } catch (error) {
            UI.showError('Failed to load finance entries');
        }
    },

    /**
     * Get finance statistics (for future analytics)
     * @returns {Promise<Object>} - Statistics object
     */
    async getStatistics() {
        try {
            const entries = await Storage.getFinances();
            
            if (entries.length === 0) {
                return {
                    total: 0,
                    worthItTotal: 0,
                    notWorthItTotal: 0,
                    worthItCount: 0,
                    notWorthItCount: 0,
                    averageSpend: 0,
                    worthItPercentage: 0
                };
            }

            const stats = entries.reduce((acc, entry) => {
                const cost = parseFloat(entry.cost);
                acc.total += cost;
                
                if (entry.worthIt) {
                    acc.worthItTotal += cost;
                    acc.worthItCount++;
                } else {
                    acc.notWorthItTotal += cost;
                    acc.notWorthItCount++;
                }
                
                return acc;
            }, {
                total: 0,
                worthItTotal: 0,
                notWorthItTotal: 0,
                worthItCount: 0,
                notWorthItCount: 0
            });

            stats.averageSpend = stats.total / entries.length;
            stats.worthItPercentage = (stats.worthItCount / entries.length) * 100;

            return stats;
        } catch (error) {
            console.error('Failed to get statistics:', error);
            return null;
        }
    }
};

// Export for global access
window.Finance = Finance;

