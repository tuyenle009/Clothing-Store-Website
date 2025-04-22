// Cấu hình dotenv ngay từ đầu
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const authRoutes = require('./routes/auth');  // Import route auth
const userRoutes = require('./routes/user');  // Import route user (có thể có các route bảo mật như profile)
const profileRoutes = require('./routes/profile');  // Nếu bạn tách riêng profile routes
const cartRouter = require('./routes/cart');
const productDetailsRouter = require('./routes/product_details');

var app = express();

// Middleware chung
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Đăng ký các route API
app.use('/auth', authRoutes);  // API cho auth (đăng nhập, đăng ký)
app.use('/user', userRoutes);  // API cho user (liên quan đến thông tin người dùng)

// Đảm bảo rằng bạn tách riêng route cho profile nếu cần
app.use('/profile', profileRoutes); // Nếu tạo riêng profile route

// Các route khác (API hoặc view)
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');
var productsRouter = require('./routes/products');
var ordersRouter = require('./routes/orders');
var orderDetailsRouter = require('./routes/order_details');
var paymentsRouter = require('./routes/payments');
var statisticsRouter = require('./routes/statistics');

// Định tuyến các API khác (ví dụ, quản lý sản phẩm, đơn hàng, v.v.)
app.use('/users', usersRouter);  // Route users (có thể bảo vệ hoặc liên quan đến admin)
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/order_details', orderDetailsRouter);
app.use('/payments', paymentsRouter);
app.use('/statistics', statisticsRouter);

app.use('/cart', cartRouter);
app.use('/product_details', productDetailsRouter);

// Định tuyến view engine nếu cần (cho giao diện frontend)
app.use('/', indexRouter);

// Cấu hình view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Xử lý lỗi 404 cho tất cả các route không tồn tại
app.use(function(req, res, next) {
  next(createError(404));
});

// Xử lý lỗi chung (500 server error)
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Khởi động server
console.log(`Server is running at http://localhost:${process.env.PORT || 5000}/`);
module.exports = app;
