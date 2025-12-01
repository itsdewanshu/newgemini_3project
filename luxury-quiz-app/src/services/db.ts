import { openDB } from 'idb';

const dbName = 'luxuryQuizDB';
const storeName = 'quizData';

const initDB = async () => {
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      db.createObjectStore(storeName, { keyPath: 'id' });
    },
  });
  return db;
};

export const saveQuizData = async (data) => {
  const db = await initDB();
  await db.put(storeName, data);
};

export const getQuizData = async (id) => {
  const db = await initDB();
  return await db.get(storeName, id);
};

export const getAllQuizData = async () => {
  const db = await initDB();
  return await db.getAll(storeName);
};

export const deleteQuizData = async (id) => {
  const db = await initDB();
  await db.delete(storeName, id);
};