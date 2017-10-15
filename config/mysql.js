const mysql = require('mysql');

module.exports = function () {
  if (process.env.CLEARDB_DATABASE_URL) {
    return mysql.createConnection(process.env.CLEARDB_DATABASE_URL)
  } else {
    return connection = mysql.createConnection({
      host     :  process.env.MYSQL_HOST,
      user     :  process.env.MYSQL_USER,
      password :  process.env.MYSQL_PASSWORD,
      database :  process.env.MYSQL_DATABASE,
      socketPath: process.env.MYSQL_SOCKETPATH
    });
  }
}
