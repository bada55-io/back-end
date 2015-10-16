'use strict';

const db = require('./db');
const Colors = require('./Colors');

module.exports = {

  create(config, cb) {

    const timestamp = config.timestamp;
    const colorId = config.color_id;

    const query = `INSERT INTO
      votes
      (color_id, created_at, updated_at)
      VALUES(${colorId}, '${timestamp}', '${timestamp}');`;

    db.update(query, cb);
  },

  like(color, cb) {


    Colors
      .byName(color, (err, data) => {

        if (!data.length) {
          return cb(true);
        }

        const colorId = data[0].id;
        const query = `SELECT * FROM votes WHERE color_id = ${colorId};`;

        db
          .all(query, (error, rep) => {

            if (error) {
              return cb(error);
            }

            const id = rep[0].id;
            const like = rep[0].like + 1;
            const updateQuery = `UPDATE votes SET like = ${like} WHERE id = ${id}`;

            db.update(updateQuery, cb);
          });

      }, true);

  }
};
