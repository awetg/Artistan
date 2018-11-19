require('dotenv').config();
// mysql2 used instead of mysql
const mysql = require('mysql2');


//creeate connection pool to reuse previous connection
const pool = mysql.createPool({
  host:  process.env.DB_HOST,
  user:  process.env.DB_USER,
  database:  process.env.DB_DATABASE,
  password:  process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


//table modules
// const User = require('./user')(pool);
// const Media = require('./media')(pool);
// User.connection.query('select * from user',(error,results,fields) => {
// 	console.log(results);
// })

module.exports = {
	User: require('./user')(pool),
	Media : require('./media')(pool),
}