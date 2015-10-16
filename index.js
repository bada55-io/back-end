'use strict';
const path = require('path');
const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');


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
  });
});

require('./src/routes/color.route')(app);
require('./src/routes/vote.route')(app);
