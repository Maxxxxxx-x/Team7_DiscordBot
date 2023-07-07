const sqlite3 = require("sqlite3").verbose();
const path = reuqire("node:path")
const fs = require("node:fs");

const DATABASE_PATH = path.join(__dirname, "StoredData.db");

function OpenConnection(){
    return sqlite3.Database(DATABASE_PATH, sqlite3.OPEN_READWRITE, (error) => {
        if (error){
            console.error(error);
            return process.exit(1);
        }
    });
}

function InitDB(){
    if (!fs.existsSync(DATABASE_PATH)){
        fs.writeFileSync(DATABASE_PATH, "")
    }
    const db = OpenConnection();
    db.serialize(() => {
        db.exec(`
        CREATE TABLE Users(
            id TEXT PRIMARY KEY,
            Birthday TEXT
        );`, (error) => {
            if (error){
                console.error(error);
                return false;
            }
        });
        return true;
    });
}