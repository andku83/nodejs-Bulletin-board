var User = require('../models/user'),
    config = require('../config'),
    async = require('async'),
    url = require('url'),
    jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens;

UserController = {};

UserController.login = function(req, res, next) {
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
                res.json({"field": "password", "message": "Wrong email or password"});
            }
        }
    ], function(err, user) {
        if (err) res.json(500, err);
        else {
            var token = jwt.sign({"id": user.id}, config.get('session:secret'), {
                expiresIn: "1d" // expires in 24 hours
            });
            // return the information including token as JSON
            res.json({token: token});
        }
    })
};

UserController.register = function(req, res, next){
    req.checkBody("email", "Enter a valid email address").isEmail();
    if (req.body.phone)
        req.checkBody("phone", "Enter a valid phone (Example +380XXXXXXXXX)").isPhoneUA();
    req.checkBody("name", "Enter a valid name (length 2-20)").len({ min: 2, max: 20 });
    req.checkBody("password", "Enter a valid valid password (length 6-20)")
        .isLength({ min: 6, max: 20 });

    var errors = req.validationErrors();
    if (errors) {
        res.status(422, "Unprocessable Entity");
        res.json(errors);
    } else {
        var user = new User({
            "email": req.body.email,
            "name": req.body.name,
            "password": req.body.password,
            "phone": req.body.phone
        });

        user.save(function (err) {
            if (err) {
                console.log(err);
                res.json(500, err);
            } else {
                var token = jwt.sign({"id": user.id}, config.get('session:secret'), {
                    expiresIn: "1d" // expires in 24 hours
                });
                // return the information including token as JSON
                res.json({
                    token: token
                });
            }
        });
    }
};

UserController.get_me = function(req, res, next){
    var id = req.decoded.id;

    User.findOne({"id": id}, function (err, user) {
        if (err) {
            console.log(err);
            res.json(500, err);
        } else if (user) {
            res.json(user.getInfo());
        } else {
            res.status(404, "Not found");
            res.end();
        }
    });

};

UserController.put_me = function(req, res, next) {
    if (req.body.email)
        req.checkBody("email", "Enter a valid email address").isEmail();
    if (req.body.phone)
        req.checkBody("phone", "Enter a valid phone (Example +380XXXXXXXXX)").isPhoneUA();
    if (req.body.name)
        req.checkBody("name", "Enter a valid name (length 2-20)").isLength({min: 2, max: 20});
    if (req.body.current_password) {
        req.checkBody("current_password", "Enter a correct current password (length 6-20)").len({min: 6, max: 20});
        if (req.body.new_password)
            req.checkBody("new_password", "Enter a valid new password (length 6-20)")
                .isLength({min: 6, max: 20});
    }

    var errors = req.validationErrors() ? req.validationErrors().slice() : [];
    if (req.body.current_password) {
        if (!req.body.new_password) {
            errors.push({
                "field": "new_password",
                "message": "Required if current password not empty."
            })
        }
    }

    if (errors.length > 0) {
        console.log(errors);
        res.status(422, "Unprocessable Entity");
        res.json(errors);
    } else {
        var id = req.decoded.id;

        User.findOne({"id": id}, function (err, user) {
            if (err) {
                console.log(err);
                res.json(500, err);
            } else if (!user) {
                res.status(404, "Not found");
                res.end();
            } else {
                if (req.body.email)
                    user.email = req.body.email;
                if (typeof req.body.phone == "string")
                    user.phone = req.body.phone;
                if (req.body.name)
                    user.name = req.body.name;
                if (req.body.current_password) {
                    if (user.checkPassword(req.body.current_password)) {
                        user.password = req.body.new_password;
                    } else {
                        res.status(422, "Unprocessable Entity");
                        res.json({"field": "password", "message": "Wrong current password"});
                        return;
                    }
                }
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.json(500, err);
                    } else {
                        res.json(user.getInfo());
                    }
                })
            }
        })
    }
};

UserController.get_user = function(req, res, next) {
    var id = req.params.id;
    User.findOne({"id": id}, function (err, user) {
        if (err) {
            console.log(err);
            res.json(500, err);
        } else if (user) {
            res.json(user.getInfo());
        } else {
            res.status(404, "Not found");
            res.end();
        }
    });
};

UserController.search_user = function(req, res, next){
    var urlParsed = url.parse(req.url, true);

    async.parallel([
        function(callback) {
            if (urlParsed.query.name) {
                var name = urlParsed.query.name;
                User.findOne({"name": name}, function (err, name) {
                    callback(err, name);
                });
            } else {
                callback (null);
            }
        },
        function(callback) {
            if (urlParsed.query.email) {
                var email = urlParsed.query.email;
                User.findOne({"email": email}, function (err, email) {
                    callback(err, email);
                });
            } else {
                callback (null);
            }
        }
    ], function(err, user) {
        if (err)
            res.json(500, err);
        else {
            if (user[0]) {
                if (user[1])
                    if (user[0].toString() == user[1].toString())
                        res.json([user[0].getInfo()]);
                    else
                        res.json([user[0].getInfo(), user[1].getInfo()]);
                else
                    res.json([user[0].getInfo()]);
            }
            else if (user[1])
                res.json([user[1].getInfo()]);
            else {
                res.status(404, "User not found");
                res.end();
            }
        }
    })
};

module.exports = UserController;