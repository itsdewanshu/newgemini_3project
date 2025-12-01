import { useEffect, useState } from 'react';
import { openDB } from 'idb';

const useIndexedDB = (dbName: string, storeName: string) => {
    const [db, setDb] = useState<IDBDatabase | null>(null);

    useEffect(() => {
        const initDB = async () => {
            const database = await openDB(dbName, 1, {
                upgrade(db) {
                    db.createObjectStore(storeName);
                },
            });
            setDb(database);
        };

        initDB();
    }, [dbName, storeName]);

    const addData = async (data: any) => {
        if (db) {
            await db.add(storeName, data);
        }
    };

    const getData = async (key: string) => {
        if (db) {
            return await db.get(storeName, key);
        }
        return null;
    };

    const getAllData = async () => {
        if (db) {
            return await db.getAll(storeName);
        }
        return [];
    };

    const deleteData = async (key: string) => {
        if (db) {
            await db.delete(storeName, key);
        }
    };

    return { addData, getData, getAllData, deleteData };
};

export default useIndexedDB;