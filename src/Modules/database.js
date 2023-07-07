const sqlite3 = require("sqlite3").verbose();
const path = require("node:path");

const db = new sqlite3.Database(path.join(__dirname, "sample.db"), sqlite3.OPEN_READWRITE, (error) => {
    if (error){
        return console.error(error);
    }
    console.log("Connected to database!");
})

let sql1 = `
CREATE TABLE IF NOT EXISTS Users(   
    MemberID TEXT PRIMARY_KEY,
    month INT
    date INT
);
`
//用戶輸入日期=>進入資料庫
Bot.on("guildMemberAdd", async (MemberID) => {
    let sql3 =`
    INSERT INTO Users (MemberID,birthmonth,birthdate) //插入新資料 (行1,行2) 數值(值1,值2)
    VALUES (UsersID,Usersmonth,Usersdate);
    `
});
//用戶離開
Bot.on("guildMemberRemove", async (MemberID) => {
    let sql7 = `
    DELETE FROM Users
    WHERE ID = "MemberID";
    `
    db.exec(sql7);
})
//每天日期增加=>搜尋資料庫
const hour = dateObject.getHours()
while(hour==0){
    const date = dateObject.getDate();
    const month = dateObject.getMonth();  
}

let sql5 = `
SELECT * FROM Users
WHERE birthdate = date && birthmonth = month;
`

