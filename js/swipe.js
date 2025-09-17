/**
 * Swipe module for handling touch and mouse gestures
 * Provides swipe-to-delete functionality for table rows on all devices
 */

const Swipe = {
    /**
     * Initialize swipe functionality
     */
    init() {
        this.bindSwipeEvents();
    },

    /**
     * Bind swipe event listeners to table containers
     */
    bindSwipeEvents() {
        const financeTable = document.getElementById('finance-table-body');
        const mediaTable = document.getElementById('media-table-body');

        if (financeTable) {
            this.addSwipeToTable(financeTable, 'finance');
        }

        if (mediaTable) {
            this.addSwipeToTable(mediaTable, 'media');
        }
    },

    /**
     * Add swipe functionality to a table
     * @param {HTMLElement} tableBody - Table body element
     * @param {string} type - Type of table ('finance' or 'media')
     */
    addSwipeToTable(tableBody, type) {
        // Touch events for mobile
        tableBody.addEventListener('touchstart', (e) => this.handleStart(e), { passive: true });
        tableBody.addEventListener('touchmove', (e) => this.handleMove(e), { passive: false });
        tableBody.addEventListener('touchend', (e) => this.handleEnd(e, type), { passive: true });
        
        // Mouse events for desktop
        tableBody.addEventListener('mousedown', (e) => this.handleStart(e), { passive: true });
        tableBody.addEventListener('mousemove', (e) => this.handleMove(e), { passive: false });
        tableBody.addEventListener('mouseup', (e) => this.handleEnd(e, type), { passive: true });
        tableBody.addEventListener('mouseleave', (e) => this.handleEnd(e, type), { passive: true });
    },

    /**
     * Handle start event (touch or mouse)
     * @param {TouchEvent|MouseEvent} e - Touch or mouse event
     */
    handleStart(e) {
        const row = e.target.closest('tr');
        if (!row || !row.hasAttribute('data-id')) return;

        // Get coordinates from touch or mouse event
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        row._swipeData = {
            startX: clientX,
            startY: clientY,
            currentX: clientX,
            startTime: Date.now(),
            isMouseDown: !e.touches // Track if this is a mouse drag
        };

        row.classList.add('table-row-swipeable');
        this.addDeleteIndicator(row);
    },

    /**
     * Handle move event (touch or mouse)
     * @param {TouchEvent|MouseEvent} e - Touch or mouse event
     */
    handleMove(e) {
        const row = e.target.closest('tr');
        if (!row || !row._swipeData) return;

        // For mouse events, only proceed if mouse is down
        if (row._swipeData.isMouseDown && e.type === 'mousemove' && e.buttons !== 1) return;

        // Get coordinates from touch or mouse event
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const deltaX = clientX - row._swipeData.startX;
        const deltaY = clientY - row._swipeData.startY;

        // Only handle horizontal swipes
        if (Math.abs(deltaY) > Math.abs(deltaX)) return;

        // Prevent scrolling when swiping horizontally
        e.preventDefault();

        row._swipeData.currentX = clientX;
        row.classList.add('swiping');

        // Only allow left swipes (negative deltaX)
        if (deltaX < 0) {
            const swipeDistance = Math.min(Math.abs(deltaX), 100);
            row.style.transform = `translateX(-${swipeDistance}px)`;

            // Show delete state when swiped far enough
            if (swipeDistance > 50) {
                row.classList.add('swipe-delete');
            } else {
                row.classList.remove('swipe-delete');
            }
        }
    },

    /**
     * Handle end event (touch or mouse)
     * @param {TouchEvent|MouseEvent} e - Touch or mouse event
     * @param {string} type - Type of table ('finance' or 'media')
     */
    handleEnd(e, type) {
        const row = e.target.closest('tr');
        if (!row || !row._swipeData) return;

        const deltaX = row._swipeData.currentX - row._swipeData.startX;
        const swipeDistance = Math.abs(deltaX);
        const swipeTime = Date.now() - row._swipeData.startTime;

        row.classList.remove('swiping');

        // Determine if this was a delete swipe
        const shouldDelete = deltaX < -50 && swipeDistance > 50 && swipeTime < 1000;

        if (shouldDelete) {
            this.performDelete(row, type);
        } else {
            // Reset row position
            row.style.transform = '';
            row.classList.remove('swipe-delete');
            this.removeDeleteIndicator(row);
        }

        // Clean up
        row.classList.remove('table-row-swipeable');
        delete row._swipeData;
    },

    /**
     * Add delete indicator to row
     * @param {HTMLElement} row - Table row element
     */
    addDeleteIndicator(row) {
        if (row.querySelector('.swipe-delete-indicator')) return;

        const indicator = document.createElement('div');
        indicator.className = 'swipe-delete-indicator';
        indicator.innerHTML = 'Delete';
        row.style.position = 'relative';
        row.appendChild(indicator);
    },

    /**
     * Remove delete indicator from row
     * @param {HTMLElement} row - Table row element
     */
    removeDeleteIndicator(row) {
        const indicator = row.querySelector('.swipe-delete-indicator');
        if (indicator) {
            indicator.remove();
        }
    },

    /**
     * Perform delete action
     * @param {HTMLElement} row - Table row element
     * @param {string} type - Type of table ('finance' or 'media')
     */
    performDelete(row, type) {
        const entryId = row.getAttribute('data-id');
        
        // Add delete animation
        row.style.transform = 'translateX(-100%)';
        row.style.opacity = '0';

        setTimeout(() => {
            if (type === 'finance') {
                Storage.removeFinance(entryId);
                Finance.loadEntries();
            } else if (type === 'media') {
                Storage.removeMedia(entryId);
                Media.loadEntries();
            }
        }, 300);
    },

    /**
     * Check if device supports touch
     * @returns {boolean} - Whether touch is supported
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
};
