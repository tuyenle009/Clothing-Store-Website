var express = require('express');
const db = require('../common/db')
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  db.connect()
  let nhanviens;
  db.query('SELECT * from users', (err, rows, fields) => {
    if (err) throw err
    else{
      nhanviens = rows;
      console.log(rows)
      res.json({ datas: nhanviens });
    }
  })
  // db.end()
});

module.exports = router;