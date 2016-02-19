var express = require('express'),
    router = express.Router(),

    api = require('./api');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/api', api);

module.exports = router;
