const db = require('./db');
const colorDiff = require('color-diff');
const colorUtils = require('color');

const FIELDS = ['color.name', 'color.label', 'color.author', 'color.twitter', 'color.created_at', 'color.lumen'];
const VOTES = 'votes.like as votes';

const fields = FIELDS.join(',') + ',' + VOTES;

function makeQuery() {
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

  byName(name, cb) {
    const query = makeQuery() + `AND color.name = '${name}';`;
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

  swatches() {
    const query = makeQuery();
    db.all(query, (err, data) => {
      // console.log(Array.isArray(data))
      // console.log(data)
      // colorDiff.diff.map_palette
      const ob = data
        .reduce((accus, color) => {
          accus[color.name] = color;
          return accus;
        }, {});

      const colors = Object.keys(ob).map(key => {
        var item = colorUtils('#' + key).rgb();

        return {
          R: item.r,
          G: item.g,
          B: item.b
        };
      });

      console.log(colorDiff.diff(
        colorDiff.rgb_to_lab(colors[0]),
        colorDiff.rgb_to_lab(colors[2])
      ))


    });
  }

};