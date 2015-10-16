'use strict';
const path = require('path');
var express     = require('express'),
    compress    = require('compression'),
    bodyParser  = require('body-parser');


const app = express();
app.use(compress());
app.use(bodyParser());

app.use(express.static(path.resolve('./app')));
app.listen(1337, function() {
  console.log('Listening on', 1337);
});

app.get('/', (req, res) => {

  return res.json({
    loaded: true
  })
});

require('./src/routes/color.route')(app);
require('./src/routes/vote.route')(app);