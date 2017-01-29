const db = require('./db');
const Votes = require('./Votes');
const queryBuilder = require('../utils/queryBuilder');
const colorDiff = require('color-diff');
const colorUtils = require('color');

module.exports = {

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

    const query = queryBuilder.build([color]);
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    db.update(query, (err, color_id) => {
      if (err) {
        return cb(err);
      }

      console.log('created data', err, id);

      Votes.create({ color_id, timestamp }, (error, data) => {
        console.log('Vote', err, data);
      });
    });
  },

  alpha({ query }, cb) {
    const factory = queryBuilder.make(false, 'ORDER BY color.label ASC');
    db.all(factory(query), cb);
  },

  byName({ params = {}, query }, cb, withId) {
    const factory = queryBuilder.make(withId, `AND color.name = '${params.color}'`);
    db.all(factory(query), cb);
  },

  byVotes({ query }, cb) {
    const factory = queryBuilder.make(false, 'ORDER BY votes.like DESC');
    return db.all(factory(query), cb);
  },

  latest({ query }, cb) {
    const factory = queryBuilder.make(false, 'ORDER BY color.created_at DESC');

    db.all(factory(query), cb);
  },

  lumen({ query }, cb) {
    const factory = queryBuilder.make(false, 'ORDER BY color.lumen DESC');
    db.all(factory(query), cb);
  },

  random({ query }, cb) {
    const factory = queryBuilder.make(false, 'ORDER BY ABS(RANDOM())');
    console.log(factory(query));
    db.all(factory(query), cb);
  },

  swatches({ query }, cb) {
    const factory = queryBuilder.make();
    db.all(factory(query), (err, data) => {

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
