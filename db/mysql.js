var mysql = require('mysql');

const pool = mysql.createPool({
  host: "us-cdbr-iron-east-01.cleardb.net",
  port: 3306,
  user: "ba73fd2998244b",
  password: "35300e22",
  database: "heroku_a3efa915644d4ec"
});

function getCon(sql, callback) {
  pool.getConnection(function (err, connection) {
    if (err) {
      return callback(true, err);
    }

    connection.query(sql, (err, result) => {
      if (err) {
        return callback(true, err);
      }

      connection.release();

      // console.log(result);
      return callback(null, result);
    });
  });
};

module.exports = {
  pool,
  getCon
};