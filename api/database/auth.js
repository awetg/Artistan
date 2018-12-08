const bcrypt = require('bcrypt');

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
				const [rows, fields] = await connection.execute(query,queryParams);
				res.send({
					user_id: rows.insertId,
					message: 'Account created successfully.'
				});
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			res.send({message: 'Require fields not provided.'});
		}
	};

	module.logIn = async(req, res) => {
		//check all required fields exist
		const allFieldsExist = ['username','password'].every(k => (k in req.body));
		if (allFieldsExist) {
			try {
				const [rows, fields] = await connection.execute('SELECT * FROM user WHERE username=?',[req.body.username]);
				if (!rows[0])
				{return res.send({message: 'Username not found.'});}
				const match = await bcrypt.compare(req.body.password, rows[0].password);
				return match ? res.send(await jwt.signToken(rows[0])) : res.send({message: 'Incorrect password'});
			} catch (error) {
				return res.status(401).json(error);
			}
		} else {
			return res.send({message: 'Required fields not provided.'});
		}
	};

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

	module.authenticate = async(req, res, next) => {
		const token = req.headers['x-access-token'];
		if (token) {
			try {
				const user = await jwt.verifyToken(token);
				if (await blackListStorage.get(user.jti)) {
					res.status(401).json('Unauthorized');
				} else {
					req.user = user;
					next();
				}
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			res.status(401).json('Unauthorized');
		}
	};

	module.authenticateAdmin = async(req, res, next) => {
		const token = req.headers['x-access-token'];
		if (token) {
			try {
				const user = await jwt.verifyToken(token);
				if (await blackListStorage.get(user.jti)) {
					return res.status(401).json('Unauterized.');
				} else {
					const [userData, fields] = await connection.query('SELECT * FROM user WHERE user_id=?', [user.user_id]);
					if (userData[0] && userData[0].admin === 1) {
						user.admin_privileges = true;
						req.user = user;
						return next();
					} else {
						return res.status(401).json('Unauterized');
					}
				}
			} catch (error) {
				return res.status(401).json(error);
			}
		} else {
			return res.status(401).json('Unauterized.');
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
				const [rows, fields] = await connection.execute(query,queryParams).catch(error => res.send(error));
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
				const [rows, fields] = await connection.query('DELETE FROM user WHERE user_id=?', req.params.user_id);
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

	module.getUser = async(req, res) => {
		try {
			const [rows, fields] = await connection.execute('SELECT user_id, fullname, username, email, time_created FROM user WHERE user_id=?', [req.params.user_id]);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	return module;
};
