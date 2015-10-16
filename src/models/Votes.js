'use strict';

const db = require('./db');
const Colors = require('./Colors');

module.exports = {

  like(color, cb) {


    Colors
      .byName(color, (err, data) => {

        if(!data.length) {
          return cb(true);
        }

        const color_id = data[0].id;
        const query = `SELECT * FROM votes WHERE color_id = ${color_id};`;

        db
          .all(query, (err, data) => {

            if(err) {
              return cb(err);
            }

            const id = data[0].id;
            const like = data[0].like + 1;
            const updateQuery = `UPDATE votes SET like = ${like} WHERE id = ${id}`;

            db.update(updateQuery, cb);
          });

      }, true);

  }
};