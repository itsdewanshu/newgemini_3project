import { QuizSet } from '../types/quizTypes';

const DB_NAME = 'luxuryQuizDB';
const DB_VERSION = 1;
const STORE_NAME = 'quizSets';

export const initQuizDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject('Error opening database');
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const addQuizSet = async (quiz: Omit<QuizSet, 'id'>): Promise<number> => {
  const db = await initQuizDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(quiz);

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as number);
    };

    request.onerror = () => {
      reject('Error adding quiz set');
    };
  });
};

export const getAllQuizSets = async (): Promise<QuizSet[]> => {
  const db = await initQuizDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as QuizSet[]);
    };

    request.onerror = () => {
      reject('Error fetching quiz sets');
    };
  });
};

export const getQuizSetById = async (id: number): Promise<QuizSet | undefined> => {
  const db = await initQuizDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as QuizSet | undefined);
    };

    request.onerror = () => {
      reject('Error fetching quiz set');
    };
  });
};

export const deleteQuizSet = async (id: number): Promise<void> => {
  const db = await initQuizDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject('Error deleting quiz set');
    };
  });
};
