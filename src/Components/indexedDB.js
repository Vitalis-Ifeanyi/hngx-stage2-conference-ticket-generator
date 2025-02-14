import { openDB } from 'idb';

// Database configuration constants
const DB_NAME = 'appDatabase';       // Name of the IndexedDB database
const STORE_NAME = 'formInputs';     // Name of the object store (similar to a table)

/**
 * Initializes or upgrades the IndexedDB database
 * @returns {Promise<IDBDatabase>} Database instance
 */
const initDB = async () => {
  return openDB(DB_NAME, 1, {  // Version 1 of the database
    upgrade(db) {
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME); // Simple key-value store
      }
    },
  });
};

/**
 * Saves form data to IndexedDB
 * @param {string} key - Unique identifier for the data
 * @param {Object} value - Data to be stored
 */
export const saveFormData = async (key, value) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');  // Read-write transaction
  const store = tx.objectStore(STORE_NAME);
  
  await store.put(value, key);  // Store data with specified key
  await tx.done;  // Wait for transaction completion
};

/**
 * Retrieves form data from IndexedDB
 * @param {string} key - Key of the data to retrieve
 * @returns {Promise<Object|null>} Stored data or null if not found
 */
export const getFormData = async (key) => {
  const db = await initDB();
  return db.get(STORE_NAME, key);  // Get data by key
};