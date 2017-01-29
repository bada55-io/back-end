const db = require('./db');
const Colors = require('./Colors');

module.exports = {

  create({ color_id, timestamp }, cb) {
    const query = `INSERT INTO
      votes
      (color_id, created_at, updated_at)
      VALUES(${color_id}, '${timestamp}', '${timestamp}');`;

    db.update(query, cb);
  },

  like(color, cb) {
    Colors.byName(color, (err, data) => {

        if (!data.length) {
          return cb(true);
        }

        const colorId = data[0].id;
        const query = `SELECT * FROM votes WHERE color_id = ${colorId};`;

        db.all(query, (error, rep = []) => {

          if (error) {
            return cb(error);
          }

          const [ { id, like } = {}] = req;
          const updateQuery = `UPDATE votes SET like = ${like + 1} WHERE id = ${id}`;

          db.update(updateQuery, cb);
        });

      }, true);
  }
};
