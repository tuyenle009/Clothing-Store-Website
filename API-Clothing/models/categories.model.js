const db = require("../common/db");

const Categories = (categories) => {
  this.category_id = categories.category_id;
  this.category_name = categories.category_name;
  this.is_deleted = categories.is_deleted;
  
};

Categories.getById = (category_id, callback) => {
  const sqlString = "SELECT * FROM categories WHERE category_id = ?";
  db.query(sqlString, [category_id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Categories.getAll = (callback) => {
  const sqlString = "SELECT * FROM categories WHERE is_deleted = 0";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Categories.insert = (categories, callBack) => {
  const sqlString = "INSERT INTO categories SET ?";
  db.query(sqlString, categories, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { category_id: res.insertId, ...categories });
  });
};

Categories.update = (categories, category_id, callBack) => {
  const sqlString = "UPDATE categories SET ? WHERE category_id = ?";
  db.query(sqlString, [categories, category_id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Cập nhật Categories có category_id = ${category_id} thành công`);
  });
};

Categories.delete = (category_id, callBack) => {
  // db.query(`DELETE FROM categories WHERE category_id = ?`, [category_id], (err, res) => {
  db.query(`UPDATE categories SET is_deleted = TRUE WHERE category_id = ?`, [category_id], (err, res) => {

    if (err) return callBack(err);
    callBack(null, `Xóa Categories có category_id = ${category_id} thành công`);
  });
};

module.exports = Categories;
