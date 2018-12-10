/* This module act as a single entry to controller modules and
* provide a connection pool as single variable to all modules making CRUD operation to database
*/
'use strict';

//using mysql2 used instead of mysql module
const mysql = require('mysql2/promise');

//creeate connection pool to reuse previous connection
const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

//each module represent a table on database(controllers for db CRUD operations)
const User = require('./users')(pool);
const Media = require('./media')(pool);
const Post = require('./post')(pool);
const Comment = require('./comment')(pool);
const Category = require('./category')(pool);
const Auth = require('./auth')(pool);

const Follower = require('./follower')(pool);
const User_Interested = require('./user_intersts')(pool);
const Search = require('./search')(pool);

module.exports = {
	User,
	Media,
	Post,
	Comment,
	Category,
	Auth,
	Follower,
	User_Interested,
	Search
};
