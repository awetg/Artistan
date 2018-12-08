/* This is controller module for authentication related operations
* This module performs CRUD operation to database on user table only
*/
const bcrypt = require('bcrypt');

//local modulse
const jwt = require('../../modules/jwt');
const blackList = require('../../modules/blacklist');

/* pass options to get blacklist storage
* if no options is passed blacklist will be saved in memory
* for production redis/memcached should be used (memcached not implemented currently)
* example const options = {
* 	type:memory||reds,
* 	server: {host:'localhost', port:11211 	}
* }
*/
const blackListStorage = blackList({type: process.env.CACHING_SERVER || 'memory'});

module.exports = (connection) => {
	const module = {};
	module.register = async(req, res) => {
		//check all required fields exist
		const allFieldsExist = ['fullname', 'email', 'username','password'].every(k => k in req.body);
		if (allFieldsExist) {
			try {
				const hash = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS) || 10);
				const query = 'INSERT INTO user (fullname, email,username,password) VALUES(?,?,?,?)';
				const queryParams = [req.body.fullname, req.body.email, req.body.username, hash];
				const [rows, _] = await connection.execute(query,queryParams);
				res.send({
					user_id: rows.insertId,
					message: 'Account created successfully.'
				});
			} catch (error) {
				(error.errno === 1062) ? res.send({error: {message: 'Username or email already exist.'}}) : res.status(401).json(error);
			}
		} else {
			res.send({message: 'Require fields not provided.'});
		}
	};

	/* Login a user and return an authentication token signed with one hour expiration time */
	module.logIn = async(req, res) => {
		//check all required fields exist
		const allFieldsExist = ['username','password'].every(k => (k in req.body));
		if (allFieldsExist) {
			try {
				const [rows, _] = await connection.execute('SELECT * FROM user WHERE username=?',[req.body.username]);
				if (!rows[0])
				{return res.send({error: {message: 'Username not found.'}});}
				const match = await bcrypt.compare(req.body.password, rows[0].password);
				return match ? res.send(await jwt.signToken(rows[0])) : res.send({error: {message: 'Incorrect password'}});
			} catch (error) {
				return res.status(401).json(error);
			}
		} else {
			return res.send({message: 'Required fields not provided.'});
		}
	};

	/* Logged out users authentication token are saved on memory or Redis until their expiration time
	* Token are signed with one hour expiration time at login time
	*/
	module.logOut = async(req, res) => {
		if (req.user) {
			try {
				await blackListStorage.set(req.user.jti, req.user.iat, req.user.exp)
					.then(value => res.send({message: 'Logged out successfully.'}));
			} catch (error) {
				res.send(error);
			}
		} else {
			res.status(401).json('Unauterized.');
		}
	};

	/* None admin accounts are authenticated here
	* Authentication is done by verifying that the token was signed by this server and
	* no trip is done to database to check if user exits as long as user have valid and not expired token
	* tokens are checked if blacklisted already
	*/
	module.authenticate = async(req, res, next) => {
		const token = req.headers['x-access-token'];
		if (token) {
			try {
				const user = await jwt.verifyToken(token);
				if (await blackListStorage.get(user.jti)) {
					res.status(401).json('Unauterized.');
				} else {
					req.user = user;
					next();
				}
			} catch (error) {
				(error.name === 'TokenExpiredError') ? res.send({error, detailts: 'Token expired. Please login again.'}) : res.status(401).json('Unauterized.');
			}
		} else {
			res.status(401).json('Unauterized.');
		}
	};

	/* Admin authentication is done here, admin accounts need to provide valid tokens
	* Every time admin routes are accessed a trip to database is done to check if the user have admin privileges
	*/
	module.authenticateAdmin = async(req, res, next) => {
		const token = req.headers['x-access-token'];
		if (token) {
			try {
				const user = await jwt.verifyToken(token);
				if (await blackListStorage.get(user.jti)) {
					return res.status(401).json('Unauterized.');
				} else {
					const [userData, _] = await connection.query('SELECT * FROM user WHERE user_id=?', [user.user_id]);
					if (userData[0] && userData[0].admin === 1) {
						user.admin_privileges = true;
						req.user = user;
						return next();
					} else {
						return res.status(401).json('Unauterized');
					}
				}
			} catch (error) {
				return (error.name === 'TokenExpiredError') ? res.send({error, detailts: 'Token expired. Please login again.'}) : res.status(401).json('Unauterized.');
			}
		} else {
			return res.status(401).json('Unauterized.');
		}
	};

	/* Admin accounts can be registered using another admin accounts */
	module.registerAdmin = async(req, res) => {
		if (req.user.admin_privileges) {
			//check all required fields exist
			const allFieldsExist = ['fullname', 'email', 'username','password'].every(k => k in req.body);
			if (allFieldsExist) {
				try {
					const hash = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS) || 10);
					const query = 'INSERT INTO user (fullname, email,username,password, admin) VALUES(?,?,?,?, ?)';
					const queryParams = [req.body.fullname, req.body.email, req.body.username, hash, 1];
					const [rows, _] = await connection.execute(query,queryParams);
					res.send({
						user_id: rows.insertId,
						message: 'Admin account created successfully.'
					});
				} catch (error) {
					res.status(401).json(error);
				}
			} else {
				res.send({message: 'Require fields not provided.'});
			}
		}
	};

	module.updateUser = async(req, res) => {
		//check all required fields exist
		const allFieldsExist = ['fullname', 'email', 'username','password'].every(k => k in req.body);

		if (allFieldsExist && req.user) {
			try {
				const hash = await bcrypt.hash(req.body.password, saltRounds);
				const query = 'UPDATE user SET fullname=?, email=?, username=?, password=? WHERE user_id=?';
				const queryParams = [req.body.fullname, req.body.email, req.body.username, hash, req.params.user_id];
				const [rows, _] = await connection.execute(query,queryParams).catch(error => res.send(error));
				res.send({message: 'User data updated'});
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			res.send({message: 'Require fields not provided.'});
		}
	};

	module.deleteUser = async(req, res) => {
		if (req.user) {
			try {
				const [rows, _] = await connection.query('DELETE FROM user WHERE user_id=?', req.params.user_id);
				if (rows.affectedRows === 1) {
					res.send({message: 'User account deleted'});
				} else {
					res.send({message: 'Error occured while deleting account'});
				}
			} catch (error) {
				res.status(401).json(error);
			}
		}
	};

	/* This function is not duplicate with user profile function, this function exposes sensitive information e.g email for account editing*/
	module.getUser = async(req, res) => {
		try {
			const [rows, _] = await connection.execute('SELECT user_id, fullname, username, email, time_created FROM user WHERE user_id=?', [req.params.user_id]);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	return module;
};
