import * as SQLite from "expo-sqlite";

const databaseName = "flora.db";
let db;

const openDatabase = async () => {
    if (!db) {
        db = await SQLite.openDatabase(databaseName);
        await createTables();
    }
    return db;
};

const createTables = async () => {
    await db.executeSql(`
        CREATE TABLE IF NOT EXISTS songs (
            id INTEGER PRIMARY KEY,
            uri TEXT,
            duration INTEGER,
            name TEXT NOT NULL,
            image TEXT,
            artist TEXT,
            albumId INTEGER,
            liked INTEGER DEFAULT 0,
            hidden INTEGER DEFAULT 0,
            FOREIGN KEY (albumId) REFERENCES albums(id)
        );
    `);

    await db.executeSql(`
        CREATE TABLE IF NOT EXISTS albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            artist TEXT
            date TEXT
            image TEXT
        )
    `);
};

export default {
    openDatabase,
};
