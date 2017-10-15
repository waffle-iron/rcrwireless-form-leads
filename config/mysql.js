const mysql = require('mysql');

module.exports = function () {
  if (process.env.JAWSDB_MARIA_URL) {
    return mysql.createConnection(process.env.JAWSDB_MARIA_URL)
  } else {
    return mysql.createConnection({
      host     :  process.env.MYSQL_HOST,
      user     :  process.env.MYSQL_USER,
      password :  process.env.MYSQL_PASSWORD,
      database :  process.env.MYSQL_DATABASE,
      socketPath: process.env.MYSQL_SOCKETPATH
    });
  }
}
