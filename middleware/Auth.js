var express = require('express'),
    config = require('../config'),
    jwt = require('jsonwebtoken');
// get an instance of the router for api routes
var Auth = express.Router();

// route middleware to verify a token
Auth.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.get('session:secret'), function(err, decoded) {
            if (err) {
                //return res.json({ success: false, message: 'Failed to authenticate token.' });
                console.log('token broken');
                res.status(401, "Unauthorized");
                res.end();
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        console.log('no token');
        res.status(401, "Unauthorized");
        res.end();

    }
});

// apply the routes to our application with the prefix /api
module.exports = Auth;