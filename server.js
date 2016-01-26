const db = require('./db'),
      config = require('./config');
var app = require('./app'),
    http = require('http');



http.createServer(app).listen(config.server.port, function() {
    console.log('Express server listening on port ' + config.server.port)
});

/*
app.listen(config.server.port, function() {
    console.log('Express server listening on port ' + config.server.port);
});

console.log(db);
*/
