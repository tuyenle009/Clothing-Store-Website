var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var app = express();

// Middleware chung
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Import routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');
var productsRouter = require('./routes/products');
var ordersRouter = require('./routes/orders');
var orderDetailsRouter = require('./routes/order_details');
var paymentsRouter = require('./routes/payments');
var statisticsRouter = require('./routes/statistics');

// Định tuyến API
app.use('/',indexRouter)
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/order_details', orderDetailsRouter);
app.use('/payments', paymentsRouter);
app.use('/statistics', statisticsRouter);

// Cấu hình view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Xử lý lỗi 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Xử lý lỗi chung
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

console.log('http://localhost:5000/');

module.exports = app;
