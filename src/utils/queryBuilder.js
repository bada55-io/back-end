const colorUtils = require('color');
const crypto = require('crypto');
const moment = require('moment');

const DATETIME = 'YYYY-MM-DD HH:mm:ss';
const FIELDS = ['name', 'label', 'author', 'twitter', 'created_at', 'lumen']
  .map((key) => `color.${key}`)
  .concat(['votes.like as votes'])
  .join(',');

const listToParams = (list = []) => list.reduce((acc, key) => acc + `"${key}"`, '');
const getHash = (value) => {
  const sha1 = crypto.createHash('sha1');
  sha1.update(value);
  return sha1.digest('hex');
}

const buildValues = ({ name = '', label = '', author = '', twitter = 0 } = {}) =>{
  const TS = moment().format(DATETIME);
  const token = getHash(name + label);
  // const lumen = colorUtils('#eee').luminosity();
  const lumen = colorUtils('#' + name).luminosity();
  const params = listToParams([name, label, lumen, author, twitter, token]);
  return `(${params},0,'${TS}','${TS}')`;
};


function insert(colors) {
  return `INSERT INTO
    colors
    (name, label, lumen, author, twitter, token, active, created_at, updated_at)
    VALUES ${colors.map(buildValues).join(',')};`;
}


function make(withId, query = '') {
  const fields = withId ? `color.id,${FIELDS}` : FIELDS;

  const SQL = `SELECT ${fields}
    FROM colors as color
    INNER JOIN votes as votes
    ON votes.color_id = color.id
    WHERE color.active = 1
    ${query}`.trim();

  return ({ limit } = {}) => {
    if (limit) {
      return `${SQL} LIMIT ${limit};`
    }
    return `${SQL};`;
  };
}

module.exports = { make, insert };
