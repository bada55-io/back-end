const db = require('./db');
const colorDiff = require('color-diff');
const colorUtils = require('color');

const FIELDS = ['color.name', 'color.label', 'color.author', 'color.twitter', 'color.created_at', 'color.lumen'];
const VOTES = 'votes.like as votes';


function makeQuery(withId) {

  var fields = FIELDS.join(',') + ',' + VOTES;

  if(withId) {
    fields = 'color.id,' + fields;
  }

  return `SELECT ${fields}
  FROM colors as color
  INNER JOIN votes as votes
  ON votes.color_id = color.id
  WHERE color.active = 1 `
}

module.exports = {

  alpha(cb) {
    const query = makeQuery() + 'ORDER BY color.label ASC;';
    db.all(query, cb);
  },

  byName(name, cb, withId) {
    const query = makeQuery(withId) + `AND color.name = '${name}';`;
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

      const fff = {R: 255,G: 255,B: 255};

      const sorted = data.sort((c1,c2) => {

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