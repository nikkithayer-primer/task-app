/**
 * Finance module for handling financial transaction logging
 * This module manages the finance form, validation, and display
 */

const Finance = {
    /**
     * Initialize finance functionality
     */
    init() {
        this.bindEvents();
        this.loadEntries();
    },

    /**
     * Bind event listeners for finance form
     */
    bindEvents() {
        const form = document.getElementById('finance-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Bind worth-it button event
        const worthItBtn = document.getElementById('finance-worth-it');
        if (worthItBtn) {
            worthItBtn.addEventListener('click', (e) => this.handleWorthItToggle(e));
        }

        // Bind delete button events (delegated event handling)
        const logContainer = document.getElementById('finance-log');
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
                amount: parseFloat(formData.amount),
                worthIt: formData.worthIt
            };

            // Save to storage
            const savedEntry = Storage.addFinance(entry);
            
            // Update display
            this.loadEntries();
            
            // Clear form
            UI.clearForm('finance-form');
            
            // Show success message
            const submitBtn = document.querySelector('#finance-form .submit-btn');
            UI.showSuccessMessage('Transaction added successfully!', submitBtn);
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
            description: document.getElementById('finance-description').value.trim(),
            amount: document.getElementById('finance-amount').value,
            worthIt: document.getElementById('finance-worth-it').getAttribute('data-worth') === 'true'
        };
    },

    /**
     * Validate form data
     * @param {Object} data - Form data to validate
     * @returns {boolean} - Whether data is valid
     */
    validateFormData(data) {
        if (!data.description) {
            this.showError('Please enter a description');
            return false;
        }

        if (!data.amount || isNaN(parseFloat(data.amount)) || parseFloat(data.amount) <= 0) {
            this.showError('Please enter a valid amount greater than 0');
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
        let errorDiv = document.querySelector('.finance-error');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'finance-error';
            errorDiv.style.cssText = `
                background: #dc3545;
                color: white;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 15px;
                font-size: 14px;
            `;
            
            const form = document.getElementById('finance-form');
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
        
        if (confirm('Are you sure you want to delete this transaction?')) {
            Storage.removeFinance(entryId);
            this.loadEntries();
        }
    },

    /**
     * Load and display finance entries
     */
    loadEntries() {
        const entries = Storage.getFinances();
        UI.displayEntries(entries, 'finance-log', 'finance');
    },

    /**
     * Get finance statistics (for future analytics)
     * @returns {Object} - Statistics object
     */
    getStatistics() {
        const entries = Storage.getFinances();
        
        if (entries.length === 0) {
            return {
                total: 0,
                worthItTotal: 0,
                notWorthItTotal: 0,
                worthItCount: 0,
                notWorthItCount: 0,
                averageSpend: 0
            };
        }

        const stats = entries.reduce((acc, entry) => {
            acc.total += entry.amount;
            
            if (entry.worthIt) {
                acc.worthItTotal += entry.amount;
                acc.worthItCount++;
            } else {
                acc.notWorthItTotal += entry.amount;
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
    },

    /**
     * Export finance data (for future enhancement)
     * @returns {string} - CSV formatted data
     */
    exportData() {
        const entries = Storage.getFinances();
        
        if (entries.length === 0) {
            return 'No data to export';
        }

        const headers = ['Date', 'Description', 'Amount', 'Worth It'];
        const csvData = [headers.join(',')];

        entries.forEach(entry => {
            const row = [
                new Date(entry.timestamp).toLocaleDateString(),
                `"${entry.description}"`,
                entry.amount,
                entry.worthIt ? 'Yes' : 'No'
            ];
            csvData.push(row.join(','));
        });

        return csvData.join('\n');
    }
};
