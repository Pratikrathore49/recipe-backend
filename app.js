const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors")

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user.route');
const recipesRouter = require("./routes/recipe.route");
const enquiryRouter = require('./routes/enquiry.route')
const { ErrorResponse } = require('./apiResponse/response');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use("/download", express.static("uploads"))

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/recipe', recipesRouter);
app.use('/enquiry', enquiryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(new ErrorResponse(err, err.message));
});

module.exports = app;
