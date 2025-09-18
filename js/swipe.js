/**
 * Swipe module for handling touch and mouse gestures
 * Provides swipe-to-delete functionality for table rows
 */

const Swipe = {
    /**
     * Initialize swipe functionality
     */
    init() {
        console.log('Swipe module initialized');
    },

    /**
     * Add swipe functionality to a table
     * @param {HTMLElement} tableBody - Table body element
     * @param {string} type - Type of table ('finance' or 'media')
     */
    addSwipeToTable(tableBody, type) {
        if (!tableBody) {
            console.warn('Table body not found for swipe initialization');
            return;
        }

        // Remove existing listeners to prevent duplicates
        this.removeSwipeFromTable(tableBody);

        // Create handlers that we can track
        const handlers = {
            touchstart: (e) => this.handleStart(e),
            touchmove: (e) => this.handleMove(e),
            touchend: (e) => this.handleEnd(e, type),
            mousedown: (e) => this.handleStart(e),
            mousemove: (e) => this.handleMove(e),
            mouseup: (e) => this.handleEnd(e, type),
            mouseleave: (e) => this.handleEnd(e, type)
        };

        // Store listeners for later removal
        tableBody._swipeListeners = [
            { event: 'touchstart', handler: handlers.touchstart, options: { passive: true } },
            { event: 'touchmove', handler: handlers.touchmove, options: { passive: false } },
            { event: 'touchend', handler: handlers.touchend, options: { passive: true } },
            { event: 'mousedown', handler: handlers.mousedown, options: { passive: true } },
            { event: 'mousemove', handler: handlers.mousemove, options: { passive: false } },
            { event: 'mouseup', handler: handlers.mouseup, options: { passive: true } },
            { event: 'mouseleave', handler: handlers.mouseleave, options: { passive: true } }
        ];

        // Add event listeners
        tableBody._swipeListeners.forEach(({ event, handler, options }) => {
            tableBody.addEventListener(event, handler, options);
        });

        console.log(`Swipe events added to ${type} table`);
    },

    /**
     * Remove swipe functionality from a table
     * @param {HTMLElement} tableBody - Table body element
     */
    removeSwipeFromTable(tableBody) {
        // Just remove the event listeners without cloning
        // The new ones will be added when addSwipeToTable is called
        if (tableBody._swipeListeners) {
            tableBody._swipeListeners.forEach(({ event, handler, options }) => {
                tableBody.removeEventListener(event, handler, options);
            });
            delete tableBody._swipeListeners;
        }
    },

    /**
     * Handle start event (touch or mouse)
     * @param {TouchEvent|MouseEvent} e - Touch or mouse event
     */
    handleStart(e) {
        const row = e.target.closest('.swipe-row');
        if (!row) return;

        // Get coordinates from touch or mouse event
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        row._swipeData = {
            startX: clientX,
            startY: clientY,
            currentX: clientX,
            startTime: Date.now(),
            isMouseDown: !e.touches
        };

        row.classList.add('swiping');
    },

    /**
     * Handle move event (touch or mouse)
     * @param {TouchEvent|MouseEvent} e - Touch or mouse event
     */
    handleMove(e) {
        const row = e.target.closest('.swipe-row');
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

        // Only allow left swipes (negative deltaX)
        if (deltaX < 0) {
            const swipeDistance = Math.min(Math.abs(deltaX), Config.SWIPE_THRESHOLD);
            row.style.transform = `translateX(-${swipeDistance}px)`;
            
            // Show delete state when swiped far enough
            if (swipeDistance > Config.SWIPE_THRESHOLD * 0.6) {
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
        const row = e.target.closest('.swipe-row');
        if (!row || !row._swipeData) return;

        const deltaX = row._swipeData.currentX - row._swipeData.startX;
        const swipeDistance = Math.abs(deltaX);
        const swipeTime = Date.now() - row._swipeData.startTime;

        row.classList.remove('swiping');

        // Determine if this was a delete swipe
        const shouldDelete = deltaX < -Config.SWIPE_THRESHOLD * 0.6 && 
                           swipeDistance > Config.SWIPE_THRESHOLD * 0.6 && 
                           swipeTime < Config.SWIPE_TIME_LIMIT;

        if (shouldDelete) {
            this.performDelete(row, type);
        } else {
            // Reset row position
            row.style.transform = '';
            row.classList.remove('swipe-delete');
        }

        // Clean up
        delete row._swipeData;
    },

    /**
     * Perform delete action
     * @param {HTMLElement} row - Row to delete
     * @param {string} type - Type of entry
     */
    async performDelete(row, type) {
        // Add delete animation
        row.style.transform = 'translateX(-100%)';
        row.style.opacity = '0';
        
        // Wait for animation then delete
        setTimeout(async () => {
            await UI.deleteEntry(row, type);
        }, 300);
    }
};

// Export for global access
window.Swipe = Swipe;

