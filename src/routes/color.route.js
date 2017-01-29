const Colors = require('../models/Colors');

module.exports = app => {

  app.post('/colors/create', (req, res) => {

    const validation = Colors.validate(req.body);

    if (validation.isValid) {
      return res.json({created: true});
    }

    return res.status(412).json(validation.error).end();
  });

  app.get('/color/:color', (req, res) => {

    if (!/^[a-f0-9]{3,6}$/.test(req.params.color)) {
      return res.json({
        message: 'Invalid color name'
      }).status(412).end();
    }

    Colors.byName(req, (err, data) => {

      if (err) {
        return res.status(500).end();
      }

      if (!data.length) {
        return res.status(404).end();
      }

      return res.json(data[0]);
    });
  });

  app.get('/colors', (req, res) => {
    Colors.byVotes(req, (err, data) => {
      console.log(err);
      return res.json(data);
    });
  });

  app.get('/colors/latest', (req, res) => {
    Colors.latest(req, (err, data) => {
      return res.json(data);
    });
  });

  app.get('/colors/random', (req, res) => {
    Colors.random(req, (err, data) => {
      return res.json(data);
    });
  });

  app.get('/colors/alpha', (req, res) => {
    Colors.alpha(req, (err, data) => {
      return res.json(data);
    });
  });

  app.get('/colors/lumens', (req, res) => {
    Colors.lumen(req, (err, data) => {
      return res.json(data);
    });
  });

  app.get('/colors/distance', (req, res) => {
    Colors.swatches(req, (err, data) => {
      return res.json(data);
    });
  });


};
