var http = require('http');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var debug = require('debug')('server');

var app = express();

require('dotenv').config()

app.set('port', process.env.PORT || '3000');
app.use(logger('dev'));
app.use(express.static('public', { maxAge: '3m' }));
app.use(favicon('public/favicon.ico'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


var server = http.createServer(app);
server.listen(app.get('port'));
server.on('error', onError);
// server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

//なにこれ
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

process.on('unhandledRejection', console.dir)
module.exports = app;
