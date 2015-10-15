const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_PATH = path.resolve(__dirname, '../../database/db.sqlite');
const DB = new sqlite3.Database(DB_PATH);



module.exports = {

  all(query, cb) {
    DB.serialize(() => DB.all(query, cb));
  }

};