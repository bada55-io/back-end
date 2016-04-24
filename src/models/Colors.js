const db = require('./db');
const Votes = require('./Votes');
const colorDiff = require('color-diff');
const colorUtils = require('color');
const moment = require('moment');
const crypto = require('crypto');

const FIELDS = ['color.name', 'color.label', 'color.author', 'color.twitter', 'color.created_at', 'color.lumen', 'votes.like as votes'].join(',');


function getHash(value) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(value);
  return sha1.digest('hex');
}

function makeQuery(withId) {
  const fields = withId ? 'color.id,' + FIELDS : FIELDS;
  return `SELECT ${fields}
    FROM colors as color
    INNER JOIN votes as votes
    ON votes.color_id = color.id
    WHERE color.active = 1 `;
}

function buildValues (color) {
  const name = color.name;
  const label = color.label;
  const author = color.author;
  const twitter = color.twitter || 0;
  const TS = moment().format('YYYY-MM-DD HH:mm:ss');
  const token = getHash(name + label);
  // const lumen = colorUtils('#eee').luminosity();
  const lumen = colorUtils('#' + name).luminosity();
  const sql = `"${name}","${label}",${lumen},"${author}",${twitter},"${token}",0,'${TS}','${TS}'`;

  return `(${sql})`;
}

function buildInsert(colors) {
  const query = `INSERT INTO
    colors
    (name, label, lumen, author, twitter, token, active, created_at, updated_at)
    VALUES ${colors.map(buildValues).join(',')};`;
  return query;
}

module.exports = {

  buildInsert,

  validate(color) {
    var validate = {};
    if (!/^[a-f0-9]{3,6}$/.test(color.name)) {
      validate['name'] = {
        valid: false,
        message: 'Invalid color name'
      };
    }

    if (!/^[a-zA-Z0-9\@\_\-\.\=\+]{2,60}$/i.test(color.author)) {
      validate['author'] = {
        valid: false,
        message: 'Invalid author name'
      };
    }

    if (!/^[a-zA-Z]{3,32}$/i.test(color.label)) {
      validate['label'] = {
        valid: false,
        message: 'Invalid label for the color'
      };
    }

    return {
      isValid: !Object.keys(validate).length,
      error: validate
    };
  },

  create(color, cb) {

    const query = buildInsert([color]);

    db
      .update(query, (err, id) => {

        if (err) {
          return cb(err);
        }

        console.log('created data', err, id);

        Votes
          .create({
            color_id: id,
            timestamp: TS
          }, (error, data) => {
            console.log('Vote', err, data);
          });

      });
  },

  alpha(cb) {
    const query = makeQuery() + 'ORDER BY color.label ASC;';
    db.all(query, cb);
  },

  byName(name, cb, withId) {
    const query = makeQuery(withId) + `AND color.name = '${name}';`;
    console.log(query)
    db.all(query, cb);
  },

  byVotes(cb) {
    const query = makeQuery() + 'ORDER BY votes.like DESC;';
    db.all(query, cb);
  },

  latest(cb) {
    const query = makeQuery() + 'ORDER BY color.created_at DESC;';
    db.all(query, cb);
  },

  lumen(cb) {
    const query = makeQuery() + 'ORDER BY color.lumen DESC;';
    db.all(query, cb);
  },

  random(cb) {
    const query = makeQuery() + 'ORDER BY ABS(RANDOM());';
    db.all(query, cb);
  },

  swatches(cb) {
    const query = makeQuery();
    db.all(query, (err, data) => {

      const fff = {R: 255, G: 255, B: 255};

      const sorted = data.sort((c1, c2) => {

        const col1 = colorUtils('#' + c1.name).rgb();
        const col2 = colorUtils('#' + c2.name).rgb();

        // Compute delta for the first color from the white
        var a = colorDiff.diff(
          colorDiff.rgb_to_lab(fff),
          colorDiff.rgb_to_lab({
            R: col1.r,
            G: col1.g,
            B: col1.b
          })
        );

        // Compute delta for the second color from the white
        var b = colorDiff.diff(
          colorDiff.rgb_to_lab(fff),
          colorDiff.rgb_to_lab({
            R: col2.r,
            G: col2.g,
            B: col2.b
          })
        );

        return a - b;
      });


      cb(err, sorted);

    });
  }

};
