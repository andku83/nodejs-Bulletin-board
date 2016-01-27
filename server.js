const db = require('./db'),
      config = require('./config');
var app = require('./app'),
    http = require('http');



/*
http.createServer(app).listen(config.get.port, function() {
    console.log('Express server listening on port ' + config.get.port)
});
*/

app.listen(config.get('port'), function() {
    console.log('Express server listening on port ' + config.get('port'));
});