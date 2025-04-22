const db = require("../common/db");

function Product_details(product_details) {
  this.detail_id = product_details.detail_id;
  this.product_id = product_details.product_id;
  this.color = product_details.color;
  this.size = product_details.size;
  this.stock_quantity = product_details.stock_quantity;
  this.image_url = product_details.image_url;
  this.is_deleted = product_details.is_deleted;
}

Product_details.getById = (id, callback) => {
  const sqlString = "SELECT * FROM product_details WHERE detail_id = ?";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result[0]);
  });
};

Product_details.getByProductId = (productId, callback) => {
  const sqlString = "SELECT * FROM product_details WHERE product_id = ? AND is_deleted = 0";
  db.query(sqlString, [productId], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Product_details.getAll = (callback) => {
  const sqlString = "SELECT * FROM product_details WHERE is_deleted = 0";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Product_details.insert = (product_details, callBack) => {
  const sqlString = "INSERT INTO product_details SET ?";
  db.query(sqlString, product_details, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { detail_id: res.insertId, ...product_details });
  });
};

Product_details.update = (product_details, id, callBack) => {
  const sqlString = "UPDATE product_details SET ? WHERE detail_id = ?";
  db.query(sqlString, [product_details, id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Cập nhật Product_details có id = ${id} thành công`);
  });
};

Product_details.delete = (id, callBack) => {
  const sqlString = "UPDATE product_details SET is_deleted = 1 WHERE detail_id = ?";
  db.query(sqlString, [id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Xóa Product_details có id = ${id} thành công`);
  });
};

module.exports = Product_details;
