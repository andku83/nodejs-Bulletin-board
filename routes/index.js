var express = require('express'),
    router = express.Router(),

    api = require('./api'),

    users = require('./users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/api', api);

router.use('/users', users);

module.exports = router;
