const Colors = require('../models/Colors');

module.exports = app => {

  app.get('/color/:color', (req, res) => {
    Colors.byName(req.params.color, (err, data) => {

      if(err) {
        return res.status(500).end();
      }

      if(!data.length) {
        return res.status(404).end();
      }

      return res.json(data[0]);
    });
  });

  app.get('/colors', (req, res) => {
    Colors.byVotes((err, data) => {
      return res.json(data);
    });
  });

  app.get('/colors/newest', (req, res) => {
    Colors.latest((err, data) => {
      return res.json(data);
    });
  });

  app.get('/colors/random', (req, res) => {
    Colors.byVotes((err, data) => {
      return res.json(data);
    });
  });

  app.get('/colors/alpha', (req, res) => {
    Colors.alpha((err, data) => {
      return res.json(data);
    });
  });

  app.get('/colors/lumens', (req, res) => {
    Colors.lumen((err, data) => {
      return res.json(data);
    });
  });

  app.get('/colors/distance', (req, res) => {
    Colors.swatches((err, data) => {
      return res.json(data);
    });
  });


};