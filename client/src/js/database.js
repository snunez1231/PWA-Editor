import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// Initialize the database
const dbPromise = initdb();

// Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  try {
    const db = await dbPromise;
    const tx = db.transaction('jate', 'readwrite');
    const store = tx.objectStore('jate');
    await store.put(content);
    await tx.complete;
    console.log('Content added to database:', content);
  } catch (error) {
    console.error('Error adding content to database:', error);
  }
};

// Add logic for a method that gets all the content from the database
export const getDb = async () => {
  try {
    const db = await dbPromise;
    const tx = db.transaction('jate', 'readonly');
    const store = tx.objectStore('jate');
    const allContent = await store.getAll();
    await tx.complete;
    console.log('All content retrieved from database:', allContent);
    return allContent;
  } catch (error) {
    console.error('Error retrieving content from database:', error);
    return [];
  }
};

// Initialize the database when the module is loaded
initdb();
