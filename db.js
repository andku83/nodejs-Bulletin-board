const mongoose = require('mongoose'),
      config = require('./config');
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'),
    function(err){
        if (err) console.log('Не удалось подключиться к БД: \n', err);
    }
);

autoIncrement.initialize(connection);

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});

module.exports = db;

/*
 module.exports =
     mongoose.createConnection('mongodb://' +
     config.connect.user + ':' +
     config.connect.password + '@' +
     config.connect.host + ':' +
     config.connect.port + '/' +
     config.connect.db);

mongoose.createConnection('mongodb://%s:%s@%s:%d/%s',
                  config.connect.user,
                  config.connect.password,
                  config.connect.host,
                  config.connect.db
);
*/