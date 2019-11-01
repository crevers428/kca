var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const history = require('connect-history-api-fallback')
const cfg = require('../config')
const jwt = require('jsonwebtoken')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//DB : Mongodb
const mongoose = require('mongoose')
module.exports.mongoose = mongoose
mongoose.connect(cfg.dbUrl, {useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) return console.log(err)
    console.log('mongoose connected!')
})

if(process.env.NODE_ENV !== 'production') app.use(cors())

app.use('/api', require('./routes/api'))
app.use(history())

app.use(express.static(path.join(__dirname, '../','fe','dist')))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ message: err.message })
});

module.exports = app;
