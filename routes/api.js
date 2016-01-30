var express = require('express');
var router = express.Router();
var UserController = require('../controllers/userController');
var Auth = require('../middleware/auth');


    /*                   USER                      */
/* Login user */
router.post('/login', UserController.login);

/* Register */
router.post('/register', UserController.register);

/* Get current user */
router.get('/me', Auth, UserController.get_me);

/* Update current user */
router.put('/me', Auth, UserController.put_me);

/* Search users */
router.get('/user/', UserController.search_user);

/* Get user by ID */
router.get('/user/:id', Auth, UserController.get_user);


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
router.put('/item/:id', Auth, function(req, res, next) {
    res.send('respond with a resource api item update');
});

/* Delete item */
router.delete('/item/:id', Auth, function(req, res, next) {
    res.send('respond with a resource api item delete');
});

/* Create item */
router.put('/item', Auth, function(req, res, next) {          //  ???????????
    res.send('respond with a resource api item create');
});


/*                  ITEM IMAGE                  */
/* Upload item image */
router.post('/item/:id/image', Auth, function(req, res, next) {
    res.send('respond with a resource api');
});

/* Upload item image */
router.delete('/item/:id/image', Auth, function(req, res, next) {
    res.send('respond with a resource api');
});


module.exports = router;
