const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
  host                : process.env.MYSQL_HOST,
  user                : process.env.MYSQL_USER,
  password            : process.env.MYSQL_PASSWORD,
  database            : process.env.MYSQL_DATABASE,
  connectionLimit     : 4,
  multipleStatements  : true
})

let query = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}

let format = function( queryString, inserts ) {
  queryString = mysql.format(queryString, inserts);
  return queryString;
}

module.exports = { query, format };
