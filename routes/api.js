var express = require('express');
var router = express.Router();
var User = require('../models/user');
var UserController = require('../controllers/userController');

/*                   USER                      */
/* Login user */
router.post('/login', UserController.login);

/* Register */
router.post('/register', UserController.register);

/* Get current user */
router.get('/me', UserController.get_me);

/* Update current user */
router.put('/me', UserController.put_me);

/* Get user by ID */
router.get('/user/:id', UserController.get_user);

/* Search users */
router.get('/user?name=:name&email=:email', UserController.search_user);


/*                   ITEM                      */
/* Search items */
router.get('/item?title=notebook&user_id=1&order_by=created_at&order_type=desc',
    function(req, res, next) {
        res.send('respond with a resource api item search');
    });

/* Get item by ID */
router.get('/item/:id', function(req, res, next) {
    res.send('respond with a resource api item');
});

/* Update item */
router.put('/item/:id', function(req, res, next) {
    res.send('respond with a resource api item update');
});

/* Delete item */
router.delete('/item/:id', function(req, res, next) {
    res.send('respond with a resource api item delete');
});

/* Create item */
router.put('/item/:id', function(req, res, next) {          //  ???????????
    res.send('respond with a resource api item create');
});




/*                  ITEM IMAGE                  */
/* Upload item image */
router.post('/item/:id/image', function(req, res, next) {
    res.send('respond with a resource api');
});

/* Upload item image */
router.delete('/item/:id/image', function(req, res, next) {
    res.send('respond with a resource api');
});


module.exports = router;
