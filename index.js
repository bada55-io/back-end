'use strict';
const path = require('path');
var express     = require('express'),
    compress    = require('compression'),
    bodyParser  = require('body-parser');

const Colors = require('./src/models/Colors');

const app = express();
app.use(compress());
app.use(bodyParser());

app.use(express.static(path.resolve('./app')));
app.listen(1337, function() {
  console.log('Listening on', 1337);
});

app.get('/', (req, res) => {

  // Colors.latest((err, data) => {
  //   console.log(data)
  // })

  // Colors.byName('bada55', (err, data) => {
  //   console.log(data)
  // })
  // Colors.byVotes((err, data) => {
  //   console.log(data)
  // })

  // Colors.alpha((err, data) => {
  //   console.log(data)
  // })
  // Colors.lumen((err, data) => {
  //   console.log(data)
  // })
// Colors.random((err, data) => {
//     console.log(data)
//   })
//
  Colors.swatches();

  return res.json({
    loaded: true
  })
});