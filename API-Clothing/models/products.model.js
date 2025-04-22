const db = require("../common/db");

const Products = (products) => {
  this.product_id = products.product_id;
  this.category_id = products.category_id;
  this.product_name = products.product_name;
  this.description = products.description;
  this.price = products.price;
  this.stock_quantity = products.stock_quantity;
  this.image_url = products.image_url;
  this.created_at = products.created_at;
  this.is_deleted = categories.is_deleted;

};

Products.getById = (product_id, callback) => {
  const sqlString = "SELECT * FROM products WHERE product_id = ?";
  db.query(sqlString, [product_id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Products.getAll = (callback) => {
  const sqlString = "SELECT * FROM products WHERE is_deleted = 0";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Products.getByCategory = (categoryId, callback) => {
  const sqlString = "SELECT * FROM products WHERE category_id = ? AND is_deleted = 0";
  db.query(sqlString, [categoryId], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Products.insert = (products, callBack) => {
  const sqlString = "INSERT INTO products SET ?";
  db.query(sqlString, products, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { product_id: res.insertId, ...products });
  });
};

Products.update = (products, product_id, callBack) => {
  const sqlString = "UPDATE products SET ? WHERE product_id = ?";
  db.query(sqlString, [products, product_id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Cập nhật Products có product_id = ${product_id} thành công`);
  });
};

Products.delete = (product_id, callBack) => {
  // db.query(`DELETE FROM products WHERE product_id = ?`, [product_id], (err, res) => {
    db.query(`UPDATE products SET is_deleted = TRUE WHERE product_id = ?`, [product_id], (err, res) => {

    if (err) return callBack(err);
    callBack(null, `Xóa Products có product_id = ${product_id} thành công`);
  });
};

module.exports = Products;
