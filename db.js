const mongoose = require('mongoose'),
      config = require('./config');

mongoose.connect('mongodb://' +
    config.connect.host + ':' +
    config.connect.port + '/' +
    config.connect.db, function(err){
        if (err) console.log('Не удалось подключиться к БД: \n', err);
    }
);

module.exports = mongoose.connection;

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