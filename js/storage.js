/**
 * Storage module for handling data persistence via Firebase Firestore
 * Uses Firebase Firestore for real-time syncing with local storage fallback
 */

const Storage = {
    // Firebase app and database instances
    app: null,
    db: null,
    
    /**
     * Initialize Firebase and storage system
     */
    async init() {
        try {
            // Initialize Firebase
            this.app = firebase.initializeApp(Config.FIREBASE);
            this.db = firebase.firestore();
            
            // Configure Firestore settings
            this.db.settings({
                cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
            });
            
            // Enable offline persistence
            await this.db.enablePersistence({ synchronizeTabs: true });
            
            console.log('Firebase storage system initialized');
        } catch (error) {
            console.warn('Firebase initialization failed, using localStorage only:', error);
        }
    },

    /**
     * Check if Firebase is available
     * @returns {boolean} - Whether Firebase is initialized
     */
    isFirebaseAvailable() {
        return this.db !== null;
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
            timestamp: firebase.firestore.Timestamp.now(),
            createdAt: new Date().toISOString(),
            type: 'finance'
        };

        try {
            if (this.isFirebaseAvailable()) {
                // Add to Firestore
                await this.db.collection(Config.COLLECTIONS.FINANCES)
                    .doc(entryWithTimestamp.id)
                    .set(entryWithTimestamp);
                
                console.log('Finance entry saved to Firestore');
            } else {
                throw new Error('Firebase not available');
            }
            
            // Also save to localStorage as backup
            this.saveToLocalStorage('finances', entryWithTimestamp);
            
            return entryWithTimestamp;
        } catch (error) {
            console.warn('Firestore save failed, using localStorage:', error);
            // Convert timestamp for localStorage
            const localEntry = {
                ...entryWithTimestamp,
                timestamp: entryWithTimestamp.createdAt
            };
            return this.saveToLocalStorage('finances', localEntry);
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
            timestamp: firebase.firestore.Timestamp.now(),
            createdAt: new Date().toISOString(),
            type: 'media'
        };

        try {
            if (this.isFirebaseAvailable()) {
                // Add to Firestore
                await this.db.collection(Config.COLLECTIONS.MEDIA)
                    .doc(entryWithTimestamp.id)
                    .set(entryWithTimestamp);
                
                console.log('Media entry saved to Firestore');
            } else {
                throw new Error('Firebase not available');
            }
            
            // Also save to localStorage as backup
            this.saveToLocalStorage('media', entryWithTimestamp);
            
            return entryWithTimestamp;
        } catch (error) {
            console.warn('Firestore save failed, using localStorage:', error);
            // Convert timestamp for localStorage
            const localEntry = {
                ...entryWithTimestamp,
                timestamp: entryWithTimestamp.createdAt
            };
            return this.saveToLocalStorage('media', localEntry);
        }
    },

    /**
     * Get all finance entries
     * @returns {Promise<Array>} - Array of finance entries
     */
    async getFinances() {
        try {
            if (this.isFirebaseAvailable()) {
                const snapshot = await this.db.collection(Config.COLLECTIONS.FINANCES)
                    .orderBy('timestamp', 'desc')
                    .get();
                
                const entries = snapshot.docs.map(doc => {
                    const data = doc.data();
                    // Convert Firestore timestamp to ISO string for consistency
                    if (data.timestamp && data.timestamp.toDate) {
                        data.timestamp = data.timestamp.toDate().toISOString();
                    }
                    return data;
                });
                
                // Update localStorage cache
                localStorage.setItem(Config.STORAGE_KEYS.FINANCES, JSON.stringify(entries));
                
                return entries;
            } else {
                throw new Error('Firebase not available');
            }
        } catch (error) {
            console.warn('Firestore read failed, using localStorage:', error);
            return this.getFromLocalStorage('finances');
        }
    },

    /**
     * Get all media entries
     * @returns {Promise<Array>} - Array of media entries
     */
    async getMedia() {
        try {
            if (this.isFirebaseAvailable()) {
                const snapshot = await this.db.collection(Config.COLLECTIONS.MEDIA)
                    .orderBy('timestamp', 'desc')
                    .get();
                
                const entries = snapshot.docs.map(doc => {
                    const data = doc.data();
                    // Convert Firestore timestamp to ISO string for consistency
                    if (data.timestamp && data.timestamp.toDate) {
                        data.timestamp = data.timestamp.toDate().toISOString();
                    }
                    return data;
                });
                
                // Update localStorage cache
                localStorage.setItem(Config.STORAGE_KEYS.MEDIA, JSON.stringify(entries));
                
                return entries;
            } else {
                throw new Error('Firebase not available');
            }
        } catch (error) {
            console.warn('Firestore read failed, using localStorage:', error);
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
            if (this.isFirebaseAvailable()) {
                await this.db.collection(Config.COLLECTIONS.FINANCES).doc(id).delete();
                console.log('Finance entry deleted from Firestore');
            } else {
                throw new Error('Firebase not available');
            }
            
            // Also update localStorage
            this.deleteFromLocalStorage('finances', id);
            
            return true;
        } catch (error) {
            console.warn('Firestore delete failed, using localStorage:', error);
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
            if (this.isFirebaseAvailable()) {
                await this.db.collection(Config.COLLECTIONS.MEDIA).doc(id).delete();
                console.log('Media entry deleted from Firestore');
            } else {
                throw new Error('Firebase not available');
            }
            
            // Also update localStorage
            this.deleteFromLocalStorage('media', id);
            
            return true;
        } catch (error) {
            console.warn('Firestore delete failed, using localStorage:', error);
            return this.deleteFromLocalStorage('media', id);
        }
    },

    /**
     * Update a finance entry
     * @param {string} id - Entry ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<Object>} - Updated entry
     */
    async updateFinance(id, updates) {
        try {
            if (this.isFirebaseAvailable()) {
                await this.db.collection(Config.COLLECTIONS.FINANCES).doc(id).update(updates);
                console.log('Finance entry updated in Firestore');
                
                // Get the updated document
                const doc = await this.db.collection(Config.COLLECTIONS.FINANCES).doc(id).get();
                const updatedEntry = doc.data();
                
                // Convert timestamp for consistency
                if (updatedEntry.timestamp && updatedEntry.timestamp.toDate) {
                    updatedEntry.timestamp = updatedEntry.timestamp.toDate().toISOString();
                }
                
                // Also update localStorage
                this.updateInLocalStorage('finances', id, updates);
                
                return updatedEntry;
            } else {
                throw new Error('Firebase not available');
            }
        } catch (error) {
            console.warn('Firestore update failed, using localStorage:', error);
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
            if (this.isFirebaseAvailable()) {
                await this.db.collection(Config.COLLECTIONS.MEDIA).doc(id).update(updates);
                console.log('Media entry updated in Firestore');
                
                // Get the updated document
                const doc = await this.db.collection(Config.COLLECTIONS.MEDIA).doc(id).get();
                const updatedEntry = doc.data();
                
                // Convert timestamp for consistency
                if (updatedEntry.timestamp && updatedEntry.timestamp.toDate) {
                    updatedEntry.timestamp = updatedEntry.timestamp.toDate().toISOString();
                }
                
                // Also update localStorage
                this.updateInLocalStorage('media', id, updates);
                
                return updatedEntry;
            } else {
                throw new Error('Firebase not available');
            }
        } catch (error) {
            console.warn('Firestore update failed, using localStorage:', error);
            return this.updateInLocalStorage('media', id, updates);
        }
    },

    /**
     * Set up real-time listeners for data changes
     * @param {Function} onFinancesChange - Callback for finance changes
     * @param {Function} onMediaChange - Callback for media changes
     */
    setupRealtimeListeners(onFinancesChange, onMediaChange) {
        if (!this.isFirebaseAvailable()) {
            console.warn('Firebase not available, real-time sync disabled');
            return;
        }

        // Listen for finance changes
        this.db.collection(Config.COLLECTIONS.FINANCES)
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                const entries = snapshot.docs.map(doc => {
                    const data = doc.data();
                    // Convert Firestore timestamp to ISO string
                    if (data.timestamp && data.timestamp.toDate) {
                        data.timestamp = data.timestamp.toDate().toISOString();
                    }
                    return data;
                });
                
                // Update localStorage cache
                localStorage.setItem(Config.STORAGE_KEYS.FINANCES, JSON.stringify(entries));
                
                if (onFinancesChange) {
                    onFinancesChange(entries);
                }
            }, (error) => {
                console.warn('Finance listener error:', error);
            });

        // Listen for media changes
        this.db.collection(Config.COLLECTIONS.MEDIA)
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                const entries = snapshot.docs.map(doc => {
                    const data = doc.data();
                    // Convert Firestore timestamp to ISO string
                    if (data.timestamp && data.timestamp.toDate) {
                        data.timestamp = data.timestamp.toDate().toISOString();
                    }
                    return data;
                });
                
                // Update localStorage cache
                localStorage.setItem(Config.STORAGE_KEYS.MEDIA, JSON.stringify(entries));
                
                if (onMediaChange) {
                    onMediaChange(entries);
                }
            }, (error) => {
                console.warn('Media listener error:', error);
            });
            
        console.log('Real-time listeners set up');
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
    },

    /**
     * Sync localStorage data to Firestore (useful for migration)
     * @returns {Promise<Object>} - Sync results
     */
    async syncLocalToFirestore() {
        if (!this.isFirebaseAvailable()) {
            throw new Error('Firebase not available');
        }

        try {
            const localFinances = this.getFromLocalStorage('finances');
            const localMedia = this.getFromLocalStorage('media');

            const results = {
                finances: { synced: 0, errors: 0 },
                media: { synced: 0, errors: 0 }
            };

            // Sync finances
            for (const entry of localFinances) {
                try {
                    const firestoreEntry = {
                        ...entry,
                        timestamp: firebase.firestore.Timestamp.fromDate(new Date(entry.timestamp || entry.createdAt))
                    };
                    
                    await this.db.collection(Config.COLLECTIONS.FINANCES)
                        .doc(entry.id)
                        .set(firestoreEntry);
                    
                    results.finances.synced++;
                } catch (error) {
                    console.error('Failed to sync finance entry:', entry.id, error);
                    results.finances.errors++;
                }
            }

            // Sync media
            for (const entry of localMedia) {
                try {
                    const firestoreEntry = {
                        ...entry,
                        timestamp: firebase.firestore.Timestamp.fromDate(new Date(entry.timestamp || entry.createdAt))
                    };
                    
                    await this.db.collection(Config.COLLECTIONS.MEDIA)
                        .doc(entry.id)
                        .set(firestoreEntry);
                    
                    results.media.synced++;
                } catch (error) {
                    console.error('Failed to sync media entry:', entry.id, error);
                    results.media.errors++;
                }
            }

            return results;
        } catch (error) {
            console.error('Sync failed:', error);
            throw error;
        }
    }
};