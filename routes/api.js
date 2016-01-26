var express = require('express');
var router = express.Router();
var User = require('../models/user');
var ObjectID = require('mongodb').ObjectID;

/*                   USER                      */
/* Login user */
router.post('/login', function(req, res, next) {
    res.send('respond with a resource api login');
});

/* Register */
router.post('/register', function(req, res, next) {
    res.send('respond with a resource api register');
});

//if (session._token){};

/* Get current user */
router.get('/me', function(req, res, next) {

    res.json({first: 'respond with a resource api me'});
});

/* Update current user */
router.put('/me', function(req, res, next) {
    res.send('respond with a resource api put me');
});

/* Get user by ID */
router.get('/user/:id', function(req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
    } catch (e) {
        console.log(e);
        res.send('no id user');
        return;
    }
    //var id=req.params.id
    console.log(req.params.id);
    console.log(id);
    User.findById(id, function(err, user){
        if (err){
            console.log(err);
            return;
        }
        if (!user){
            next();
        }
        else {
            res.json(user);
            res.end();
        }
    });
});

/* Search users */
router.get('/user?name=:name&email=:email', function(req, res, next) {
    res.send('respond with a resource api');
});




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
