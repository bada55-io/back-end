const Votes = require('../models/Votes');

module.exports = app => {

  app.get('/like/:color', (req, res) => {

    if (!/^[a-f0-9]{3,6}$/.test(req.params.color)) {
      return res.json({
        message: 'Invalid color name'
      }).status(412).end();
    }


    Votes.like(req.params.color, function (err, data) {

      console.log('arg', err, data);
      if (err) {
        return res.status(500).end();
      }
      console.log(err, data);
      // if(!data.length) {
      //   return res.status(404).end();
      // }

      return res.json(data);
    });
  });

};
