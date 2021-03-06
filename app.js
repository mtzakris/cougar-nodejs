var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var moment = require('moment');
var routes = require('./routes/index');
var bets = require('./routes/bet');

var betfairService = require('./api/services/BetfairService');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/startBet', bets);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //res.render('error', {
    //  message: err.message,
    //  error: err
    //});
    next(err);
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  //res.render('error', {
  //  message: err.message,
  //  error: {}
  //});
  next(err);
});

app.use(function (req, res, next) {
    var dateNow = moment();
    if(dateNow > loginMoment.expirationDate){
        betfairService.keepAlive(function(error){
            if(error){
                betfairService.login(function(error){
                    return next(error);
                })
            }{
                return next(null);
            }
        })
    }else{
        next(null);
    }
});

// Listen termination signal
process.on('SIGTERM', function () {
    console.log("mb application stopped");
    process.exit(0);
});


module.exports = app;
