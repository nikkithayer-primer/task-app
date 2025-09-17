/**
 * UI module for handling user interface interactions
 * This module manages tab switching, form interactions, and display logic
 */

const UI = {
    /**
     * Initialize UI components
     */
    init() {
        this.initTabs();
        this.initEventListeners();
    },

    /**
     * Initialize tab functionality
     */
    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    },

    /**
     * Initialize global event listeners
     */
    initEventListeners() {
        // Handle form submissions will be handled by individual modules
        // This is for any global UI interactions
        
        // Add smooth scrolling for better UX
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    },

    /**
     * Format date for display
     * @param {string} isoString - ISO date string
     * @returns {string} - Formatted date string
     */
    formatDate(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString();
    },

    /**
     * Format currency for display
     * @param {number} amount - Amount to format
     * @returns {string} - Formatted currency string
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    /**
     * Create a log entry element
     * @param {Object} entry - Entry data
     * @param {string} type - Type of entry ('finance' or 'media')
     * @returns {HTMLElement} - Log entry element
     */
    createLogEntry(entry, type) {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'log-entry';
        entryDiv.setAttribute('data-id', entry.id);

        const headerDiv = document.createElement('div');
        headerDiv.className = 'log-entry-header';

        const dateSpan = document.createElement('span');
        dateSpan.className = 'log-entry-date';
        dateSpan.textContent = this.formatDate(entry.timestamp);

        const worthSpan = document.createElement('span');
        worthSpan.className = `log-entry-worth ${entry.worthIt ? 'worth-yes' : 'worth-no'}`;
        worthSpan.textContent = entry.worthIt ? '✓ Worth it' : '✗ Not worth it';

        headerDiv.appendChild(dateSpan);
        headerDiv.appendChild(worthSpan);

        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'log-entry-description';
        descriptionDiv.textContent = entry.description;

        entryDiv.appendChild(headerDiv);
        entryDiv.appendChild(descriptionDiv);

        // Add amount for finance entries
        if (type === 'finance' && entry.amount !== undefined) {
            const amountDiv = document.createElement('div');
            amountDiv.className = 'log-entry-amount';
            amountDiv.textContent = this.formatCurrency(entry.amount);
            entryDiv.appendChild(amountDiv);
        }

        // Add delete button (optional for future enhancement)
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
            font-size: 14px;
        `;
        
        entryDiv.style.position = 'relative';
        entryDiv.addEventListener('mouseenter', () => deleteBtn.style.opacity = '1');
        entryDiv.addEventListener('mouseleave', () => deleteBtn.style.opacity = '0');
        
        entryDiv.appendChild(deleteBtn);

        return entryDiv;
    },

    /**
     * Display entries in a log container
     * @param {Array} entries - Array of entries to display
     * @param {string} containerId - ID of the container element
     * @param {string} type - Type of entries ('finance' or 'media')
     */
    displayEntries(entries, containerId, type) {
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container with ID ${containerId} not found`);
            return;
        }

        if (type === 'finance') {
            this.displayFinanceTable(entries, containerId);
        } else if (type === 'media') {
            this.displayMediaTable(entries, containerId);
        } else {
            this.displayMediaCards(entries, containerId, type);
        }
    },

    /**
     * Display finance entries as a table
     * @param {Array} entries - Array of finance entries
     * @param {string} containerId - ID of the container element
     */
    displayFinanceTable(entries, containerId) {
        const table = document.getElementById('finance-table');
        const tableBody = document.getElementById('finance-table-body');
        const emptyState = document.getElementById('finance-empty-state');

        if (!table || !tableBody || !emptyState) {
            console.error('Finance table elements not found');
            return;
        }

        // Clear existing entries
        tableBody.innerHTML = '';

        if (entries.length === 0) {
            table.style.display = 'none';
            emptyState.style.display = 'block';
            emptyState.textContent = 'No finance entries yet. Add your first transaction above!';
            return;
        }

        // Show table and hide empty state
        table.style.display = 'table';
        emptyState.style.display = 'none';

        // Create table rows
        entries.forEach(entry => {
            const row = this.createFinanceTableRow(entry);
            tableBody.appendChild(row);
        });
    },

    /**
     * Display media entries as cards (keep existing card layout)
     * @param {Array} entries - Array of media entries
     * @param {string} containerId - ID of the container element
     * @param {string} type - Type of entries
     */
    displayMediaCards(entries, containerId, type) {
        const container = document.getElementById(containerId);
        
        // Clear existing entries
        container.innerHTML = '';

        if (entries.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = `No ${type} entries yet. Add your first entry above!`;
            container.appendChild(emptyState);
            return;
        }

        // Create and append entry elements
        entries.forEach(entry => {
            const entryElement = this.createLogEntry(entry, type);
            container.appendChild(entryElement);
        });
    },

    /**
     * Create a finance table row
     * @param {Object} entry - Finance entry data
     * @returns {HTMLElement} - Table row element
     */
    createFinanceTableRow(entry) {
        const row = document.createElement('tr');
        row.setAttribute('data-id', entry.id);

        // Date column
        const dateCell = document.createElement('td');
        dateCell.className = 'table-date';
        dateCell.textContent = this.formatDate(entry.timestamp);

        // Description column
        const descCell = document.createElement('td');
        descCell.className = 'table-description';
        descCell.textContent = entry.description;
        descCell.title = entry.description; // Show full text on hover

        // Amount column
        const amountCell = document.createElement('td');
        amountCell.className = 'table-amount';
        amountCell.textContent = this.formatCurrency(entry.amount);

        // Worth it column
        const worthCell = document.createElement('td');
        worthCell.className = `table-worth ${entry.worthIt ? 'worth-yes' : 'worth-no'}`;
        worthCell.textContent = entry.worthIt ? '✓ Yes' : '✗ No';

        // Actions column
        const actionsCell = document.createElement('td');
        actionsCell.className = 'table-actions';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete transaction';
        
        actionsCell.appendChild(deleteBtn);

        // Append all cells to row
        row.appendChild(dateCell);
        row.appendChild(descCell);
        row.appendChild(amountCell);
        row.appendChild(worthCell);
        row.appendChild(actionsCell);

        return row;
    },

    /**
     * Display media entries as a table
     * @param {Array} entries - Array of media entries
     * @param {string} containerId - ID of the container element
     */
    displayMediaTable(entries, containerId) {
        const table = document.getElementById('media-table');
        const tableBody = document.getElementById('media-table-body');
        const emptyState = document.getElementById('media-empty-state');

        if (!table || !tableBody || !emptyState) {
            console.error('Media table elements not found');
            return;
        }

        // Clear existing entries
        tableBody.innerHTML = '';

        if (entries.length === 0) {
            table.style.display = 'none';
            emptyState.style.display = 'block';
            emptyState.textContent = 'No media entries yet. Add your first entry above!';
            return;
        }

        // Show table and hide empty state
        table.style.display = 'table';
        emptyState.style.display = 'none';

        // Create table rows
        entries.forEach(entry => {
            const row = this.createMediaTableRow(entry);
            tableBody.appendChild(row);
        });
    },

    /**
     * Create a media table row
     * @param {Object} entry - Media entry data
     * @returns {HTMLElement} - Table row element
     */
    createMediaTableRow(entry) {
        const row = document.createElement('tr');
        row.setAttribute('data-id', entry.id);

        // Date column
        const dateCell = document.createElement('td');
        dateCell.className = 'table-date';
        dateCell.textContent = this.formatDate(entry.timestamp);

        // Description column
        const descCell = document.createElement('td');
        descCell.className = 'table-description';
        descCell.textContent = entry.description;
        descCell.title = entry.description; // Show full text on hover

        // Worth it column
        const worthCell = document.createElement('td');
        worthCell.className = `table-worth ${entry.worthIt ? 'worth-yes' : 'worth-no'}`;
        worthCell.textContent = entry.worthIt ? '✓ Yes' : '✗ No';

        // Actions column
        const actionsCell = document.createElement('td');
        actionsCell.className = 'table-actions';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete media log';
        
        actionsCell.appendChild(deleteBtn);

        // Append all cells to row
        row.appendChild(dateCell);
        row.appendChild(descCell);
        row.appendChild(worthCell);
        row.appendChild(actionsCell);

        return row;
    },

    /**
     * Clear form inputs
     * @param {string} formId - ID of the form to clear
     */
    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    },

    /**
     * Show a temporary success message
     * @param {string} message - Message to show
     * @param {HTMLElement} targetElement - Element to show message near
     */
    showSuccessMessage(message, targetElement) {
        const successDiv = document.createElement('div');
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: absolute;
            background: #28a745;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        `;

        // Position near target element
        const rect = targetElement.getBoundingClientRect();
        successDiv.style.top = (rect.bottom + window.scrollY + 10) + 'px';
        successDiv.style.left = rect.left + 'px';

        document.body.appendChild(successDiv);

        // Remove after animation
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 2000);
    }
};
