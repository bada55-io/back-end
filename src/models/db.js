const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_PATH = path.resolve(__dirname, '../../database/db.sqlite');
const DB = new sqlite3.Database(DB_PATH);

module.exports = {

  all(query, cb) {
    DB.serialize(() => DB.all(query, cb));
  },

  /**
   * Like a color
   * Cannot use a fat arrow function because the callback response is in da this.
   * Fuuuuu
   * cf @link https://github.com/mapbox/node-sqlite3/wiki/API#databaserunsql-param--callback
   */
  update(query, cb) {
    return DB.run(query, [], function(err) {
      cb(0 === this.changes || err, this.lastID);
    });
  }

};
