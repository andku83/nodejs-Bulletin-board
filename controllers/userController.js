var mongoose = require('mongoose'),
    User = require('../models/user'),
    config = require('../config'),
    ObjectID = require('mongodb').ObjectID,
    async = require('async'),
    jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens;

UserController = {};

var superSecret = config.get('session:secret'); // secret variable

UserController.login = function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    async.waterfall([
        function(callback) {
            User.findOne({email: email}, callback);
        },
        function(user, callback) {
            if (user){
                if (user.checkPassword(password)) {
                    callback(null, user);
                } else {
                    res.status(422, "Unprocessable Entity");
                    res.json({"field":"password", "message":"Wrong email or password"});
                }
            } else {
                res.status(422, "Unprocessable Entity");
                res.json({"field":"password", "message":"Wrong email or password"});
            }
        }
    ], function(err, user) {
        if (err) return next(err);

        var token = jwt.sign(user, superSecret, {
            expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
        });
    })
};

UserController.register = function(req, res, next){
    var is_exist = function ($name, value){
        User.find({$name: req.body.$name}, function(err, user){
            if (err) next(err);
            if (user.$name == value) return true;
            else return false;
        })
    };
    var duplicate = [];
    if ("name", req.body.name) {
        duplicate.push({"field": "current_name", "message": "Wrong name"});
    }
    if (!req.body.email || User.find({"email": req.body.email})) {
        duplicate.push({"field": "current_email","message":"Wrong email"});
    }
    if (!req.body.phone || User.find({"phone": req.body.phone})) {
        duplicate.push({"field": "current_phone","message":"Wrong phone"});
    }
    console.log(duplicate);
    if (duplicate.length > 0){
        console.log('???');
        //res.send(duplicate);
        res.json(
            );
        return
    }

    var user = new User({"name" : req.body.name,
        "password" : req.body.password,
        "email" : req.body.email,
        "phone" : req.body.phone
    });

    user.save(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        //console.log(user);
        res.json({token: "3f5uh28"});
        return
        res.end()
    });
};

UserController.get_me = function(req, res, next){
    res.end('hi!');

};

UserController.put_me = function(req, res, next){
    res.end('hi!');

};

UserController.get_user = function(req, res, next) {
// это ID, который мы отправляем через URL
    var id = req.params.id;
    console.log(typeof (id))
// находим элемент списка задач с соответствующим ID
    User.find({"id": id}, function (err, user) {
        if (err !== null) {
            res.json(err);
        } else {
            if (user.length > 0) {
                res.json(user/*{
                    "id": user._id,
                    "phone": user.phone,
                    "name": user.name,
                    "email": user.email
                }*/);
            } else {
                res.send("Не найдено");
            }
        }
    });
    //    try {
//        var id = new ObjectID(req.params.id);
//    } catch (e) {
//        console.log(e);
//        res.send('no id user');
//        return;
//    }
//    //var id=req.params.id
//    console.log(req.params.id);
//    console.log(id);
//    User.findById(id, function(err, user){
//        if (err){
//            console.log(err);
//            return;
//        }
//        if (!user){
//            next();
//        }
//        else {
//            res.json(user);
//            res.end();
//        }
//    });
};

UserController.search_user = function(req, res, next){

};

module.exports = ('UserController', UserController);


// /* Login user */
//router.post('/login', function(req, res, next) {
//    res.send('respond with a resource api login');
//});
//
///* Register */
//router.post('/register', function(req, res, next) {
//    res.send('respond with a resource api register');
//});
//
////if (session._token){};
//
///* Get current user */
//router.get('/me', function(req, res, next) {
//
//    res.json({first: 'respond with a resource api me'});
//});
//
///* Update current user */
//router.put('/me', function(req, res, next) {
//    res.send('respond with a resource api put me');
//});
//
///* Get user by ID */
//router.get('/user/:id', function(req, res, next) {
//    try {
//        var id = new ObjectID(req.params.id);
//    } catch (e) {
//        console.log(e);
//        res.send('no id user');
//        return;
//    }
//    //var id=req.params.id
//    console.log(req.params.id);
//    console.log(id);
//    User.findById(id, function(err, user){
//        if (err){
//            console.log(err);
//            return;
//        }
//        if (!user){
//            next();
//        }
//        else {
//            res.json(user);
//            res.end();
//        }
//    });
//});
//
///* Search users */
//router.get('/user?name=:name&email=:email', function(req, res, next) {
//    res.send('respond with a resource api');
//});
//
//