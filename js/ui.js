/**
 * UI module for handling user interface interactions
 * Manages display updates, form interactions, and visual feedback
 */

const UI = {
    /**
     * Initialize UI components
     */
    init() {
        this.bindTabEvents();
        this.bindWorthItEvents();
        this.bindValidationEvents();
        this.checkGitHubSetup();
        this.showLoading(false);
    },

    /**
     * Bind tab switching events
     */
    bindTabEvents() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
    },

    /**
     * Bind worth it click events (delegated event handling)
     */
    bindWorthItEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('clickable-worth')) {
                this.toggleWorthItInTable(e.target);
            }
        });
    },

    /**
     * Bind custom validation events
     */
    bindValidationEvents() {
        // Prevent default browser validation tooltips
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.showCustomValidation(e.target);
            }, true);

            form.addEventListener('submit', (e) => {
                const invalidInputs = form.querySelectorAll(':invalid');
                if (invalidInputs.length > 0) {
                    e.preventDefault();
                    // Mark all inputs as touched when submit is attempted
                    const allInputs = form.querySelectorAll('input[required]');
                    allInputs.forEach(input => this.markAsTouched(input));
                    this.showCustomValidation(invalidInputs[0]);
                    invalidInputs[0].focus();
                }
            });
        });

        // Hide validation tooltips when user starts typing
        const inputs = document.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.markAsTouched(input);
                this.hideCustomValidation(input);
            });

            input.addEventListener('blur', () => {
                this.markAsTouched(input);
                if (!input.validity.valid) {
                    this.showCustomValidation(input);
                }
            });

            input.addEventListener('focus', () => {
                this.markAsTouched(input);
            });
        });
    },

    /**
     * Mark input as touched (user has interacted with it)
     * @param {HTMLElement} input - Input element
     */
    markAsTouched(input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('touched');
        }
    },

    /**
     * Show custom validation tooltip
     * @param {HTMLElement} input - Input element that failed validation
     */
    showCustomValidation(input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('show-validation');
            
            // Hide after 3 seconds
            setTimeout(() => {
                this.hideCustomValidation(input);
            }, 3000);
        }
    },

    /**
     * Hide custom validation tooltip
     * @param {HTMLElement} input - Input element
     */
    hideCustomValidation(input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('show-validation');
        }
    },

    /**
     * Switch between tabs
     * @param {string} tabName - Name of tab to switch to
     */
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabName);
        });

        // Update forms
        document.querySelectorAll('.entry-form').forEach(form => {
            form.classList.toggle('active', form.id === `${tabName}-form`);
        });
    },

    /**
     * Display finance entries in table
     * @param {Array} entries - Array of finance entries
     */
    displayFinances(entries) {
        const table = document.getElementById('finance-table');
        const tableBody = document.getElementById('finance-table-body');
        const emptyState = document.getElementById('finance-empty-state');

        if (entries.length === 0) {
            table.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        table.style.display = 'table';
        emptyState.style.display = 'none';
        
        tableBody.innerHTML = '';
        
        entries.forEach(entry => {
            const row = this.createFinanceRow(entry);
            tableBody.appendChild(row);
        });

        // Reinitialize swipe events
        if (window.Swipe) {
            Swipe.addSwipeToTable(tableBody, 'finance');
        }
    },

    /**
     * Display media entries in table
     * @param {Array} entries - Array of media entries
     */
    displayMedia(entries) {
        const table = document.getElementById('media-table');
        const tableBody = document.getElementById('media-table-body');
        const emptyState = document.getElementById('media-empty-state');

        if (entries.length === 0) {
            table.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        table.style.display = 'table';
        emptyState.style.display = 'none';
        
        tableBody.innerHTML = '';
        
        entries.forEach(entry => {
            const row = this.createMediaRow(entry);
            tableBody.appendChild(row);
        });

        // Reinitialize swipe events
        if (window.Swipe) {
            Swipe.addSwipeToTable(tableBody, 'media');
        }
    },

    /**
     * Create a finance table row
     * @param {Object} entry - Finance entry data
     * @returns {HTMLElement} - Table row element
     */
    createFinanceRow(entry) {
        const row = document.createElement('tr');
        row.className = 'swipe-row';
        row.dataset.id = entry.id;

        const dateCell = document.createElement('td');
        dateCell.className = 'date-cell';
        dateCell.textContent = this.formatDate(entry.timestamp);

        const descCell = document.createElement('td');
        descCell.className = 'desc-cell';
        descCell.textContent = entry.description;

        const costCell = document.createElement('td');
        costCell.className = 'cost-cell';
        costCell.textContent = this.formatCurrency(entry.cost);

        const worthCell = document.createElement('td');
        worthCell.className = `worth-cell clickable-worth ${entry.worthIt ? 'worth-yes' : 'worth-no'}`;
        worthCell.textContent = entry.worthIt ? '👍' : '👎';
        worthCell.dataset.worth = entry.worthIt;
        worthCell.dataset.entryId = entry.id;
        worthCell.dataset.type = 'finance';

        const deleteIndicator = document.createElement('div');
        deleteIndicator.className = 'swipe-delete-indicator';
        deleteIndicator.textContent = 'Delete';

        row.appendChild(dateCell);
        row.appendChild(descCell);
        row.appendChild(costCell);
        row.appendChild(worthCell);
        row.appendChild(deleteIndicator);

        return row;
    },

    /**
     * Create a media table row
     * @param {Object} entry - Media entry data
     * @returns {HTMLElement} - Table row element
     */
    createMediaRow(entry) {
        const row = document.createElement('tr');
        row.className = 'swipe-row';
        row.dataset.id = entry.id;

        const dateCell = document.createElement('td');
        dateCell.className = 'date-cell';
        dateCell.textContent = this.formatDate(entry.timestamp);

        const descCell = document.createElement('td');
        descCell.className = 'desc-cell';
        descCell.textContent = entry.description;

        const worthCell = document.createElement('td');
        worthCell.className = `worth-cell clickable-worth ${entry.worthIt ? 'worth-yes' : 'worth-no'}`;
        worthCell.textContent = entry.worthIt ? '👍' : '👎';
        worthCell.dataset.worth = entry.worthIt;
        worthCell.dataset.entryId = entry.id;
        worthCell.dataset.type = 'media';

        const deleteIndicator = document.createElement('div');
        deleteIndicator.className = 'swipe-delete-indicator';
        deleteIndicator.textContent = 'Delete';

        row.appendChild(dateCell);
        row.appendChild(descCell);
        row.appendChild(worthCell);
        row.appendChild(deleteIndicator);

        return row;
    },

    /**
     * Format date for display
     * @param {string} timestamp - ISO timestamp
     * @returns {string} - Formatted date (DD/MM/YY)
     */
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
    },

    /**
     * Format currency for display
     * @param {number} amount - Amount to format
     * @returns {string} - Formatted currency
     */
    formatCurrency(amount) {
        return `$${parseFloat(amount).toFixed(2)}`;
    },

    /**
     * Clear form inputs
     * @param {string} formId - ID of form to clear
     */
    clearForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        // Clear text inputs
        const inputs = form.querySelectorAll('input[type="text"], input[type="number"]');
        inputs.forEach(input => input.value = '');

        // Reset worth buttons to thumbs up
        const worthBtns = form.querySelectorAll('.worth-btn');
        worthBtns.forEach(btn => {
            btn.dataset.worth = 'true';
            btn.textContent = '👍';
        });

        // Remove touched and validation states
        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('touched', 'show-validation');
        });
    },

    /**
     * Show/hide loading spinner
     * @param {boolean} show - Whether to show loading
     */
    showLoading(show) {
        const loading = document.getElementById('loading');
        loading.classList.toggle('hidden', !show);
    },

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        // Simple success feedback - could be enhanced with toast notifications
        console.log('Success:', message);
    },

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        // Simple error feedback - could be enhanced with toast notifications
        console.error('Error:', message);
        alert(`Error: ${message}`);
    },

    /**
     * Toggle worth it status in table
     * @param {HTMLElement} cell - Worth it cell that was clicked
     */
    async toggleWorthItInTable(cell) {
        const entryId = cell.dataset.entryId;
        const type = cell.dataset.type;
        const currentWorth = cell.dataset.worth === 'true';
        const newWorth = !currentWorth;

        try {
            this.showLoading(true);

            // Update the entry in storage
            if (type === 'finance') {
                await this.updateFinanceWorthIt(entryId, newWorth);
            } else {
                await this.updateMediaWorthIt(entryId, newWorth);
            }

            // Update the UI immediately
            cell.dataset.worth = newWorth;
            cell.textContent = newWorth ? '👍' : '👎';
            cell.className = `worth-cell clickable-worth ${newWorth ? 'worth-yes' : 'worth-no'}`;

            this.showSuccess('Updated successfully');
        } catch (error) {
            this.showError('Failed to update entry');
        } finally {
            this.showLoading(false);
        }
    },

    /**
     * Update finance entry worth it status
     * @param {string} id - Entry ID
     * @param {boolean} worthIt - New worth it status
     */
    async updateFinanceWorthIt(id, worthIt) {
        await Storage.updateFinance(id, { worthIt });
    },

    /**
     * Update media entry worth it status
     * @param {string} id - Entry ID
     * @param {boolean} worthIt - New worth it status
     */
    async updateMediaWorthIt(id, worthIt) {
        await Storage.updateMedia(id, { worthIt });
    },

    /**
     * Check if GitHub setup is needed
     */
    checkGitHubSetup() {
        const token = Config.getGitHubToken();
        const setupSkipped = localStorage.getItem('github_setup_skipped');
        
        if (!token && !setupSkipped) {
            // Show setup modal after a short delay
            setTimeout(() => {
                this.showGitHubSetup();
            }, 1000);
        }
    },

    /**
     * Show GitHub setup modal
     */
    showGitHubSetup() {
        const modal = document.getElementById('github-setup-modal');
        modal.classList.remove('hidden');
    },

    /**
     * Hide GitHub setup modal
     */
    hideGitHubSetup() {
        const modal = document.getElementById('github-setup-modal');
        modal.classList.add('hidden');
    },

    /**
     * Save GitHub token from modal
     */
    async saveGitHubToken() {
        const input = document.getElementById('github-token-input');
        const token = input.value.trim();
        
        if (!token) {
            this.showError('Please enter a GitHub token');
            return;
        }

        try {
            this.showLoading(true);
            
            // Test the token by making a simple API call
            const testResponse = await fetch(`${Config.GITHUB_API_BASE}/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!testResponse.ok) {
                throw new Error('Invalid token');
            }

            // Save the token
            Config.setGitHubToken(token);
            
            // Try to sync any existing local data
            try {
                const syncResults = await Storage.syncLocalToGitHub();
                console.log('Sync results:', syncResults);
            } catch (syncError) {
                console.warn('Initial sync failed:', syncError);
            }
            
            this.hideGitHubSetup();
            this.showSuccess('GitHub token saved! Data will now sync between devices.');
            
            // Reload data from GitHub
            Finance.loadEntries();
            Media.loadEntries();
            
        } catch (error) {
            this.showError('Invalid GitHub token. Please check and try again.');
        } finally {
            this.showLoading(false);
        }
    },

    /**
     * Skip GitHub setup
     */
    skipGitHubSetup() {
        localStorage.setItem('github_setup_skipped', 'true');
        this.hideGitHubSetup();
        this.showSuccess('Using local storage only. Data will not sync between devices.');
    },

    /**
     * Delete entry from UI
     * @param {HTMLElement} row - Table row to delete
     * @param {string} type - Type of entry (finance/media)
     */
    async deleteEntry(row, type) {
        const id = row.dataset.id;
        
        try {
            this.showLoading(true);
            
            if (type === 'finance') {
                await Storage.deleteFinance(id);
                Finance.loadEntries();
            } else {
                await Storage.deleteMedia(id);
                Media.loadEntries();
            }
            
            this.showSuccess('Entry deleted successfully');
        } catch (error) {
            this.showError('Failed to delete entry');
        } finally {
            this.showLoading(false);
        }
    }
};

