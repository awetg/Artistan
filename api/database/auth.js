const bcrypt = require('bcrypt');

const jwt = require('../../modules/jwt');
const blackList = require('../../modules/blacklist');
/* if no options is passed blacklist will be saved in memory
* example const options = {
* 	type:memory||memcached||reds,
* 	server: {vhost:'localhost', port:11211 	}
* }
*/
const blackListStorage = blackList();

module.exports = (connection) => {
	const module = {};
	module.register = async(req, res) => {
		//check all required fields exist
		const allFieldsExist = ['fullname', 'email', 'username','password'].every(k => k in req.body);
		if (allFieldsExist) {
			try {
				const hash = await bcrypt.hash(req.body.password, process.env.SALT_ROUNDS || 10);
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
				if(!rows[0])
					return res.send({message: 'Username not found.'});
				const match = await bcrypt.compare(req.body.password, rows[0].password);
				match? res.send(await jwt.signToken(rows[0])) : res.send({message: 'Incorrect password'});
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			res.send({message: 'Required fields not provided.'});
		}
	};

	module.logOut = async (req, res) => {
		if(req.user) {
			try {
				await blackListStorage.set(req.user.jti, req.user.iat, req.user.exp).then(value => res.send({message: 'Logged out successfully.'}));
			} catch (error) {
				console.log(error);
				res.send(error);
			}
		} else {
			res.status(401).json('Unauterized.');
		}
	}

	module.authenticate = async (req, res, next) => {
		const token = req.headers['x-access-token'];
		if(token) {
			try{
				const user = await jwt.verifyToken(token);
				if(await blackListStorage.get(user.jti)) {
					res.status(401).json('Unauterized.');
				} else {
					req.user = user;
					next();
				}
			} catch(error) {
				res.status(401).json(error);
			}
		} else {
			res.status(401).json('Unauterized.');
		}
	}

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
				if (rows.affectedRows == 1) {
					res.send({message: 'User account deleted'});
				} else {
					res.send({message: 'Error occured while deleting account'});
				}
			} catch (error) {
				res.status(401).json(error);
			}
		}
	};

	module.getAllUsers = async(req, res) => {
		try {
			const [rows, fields] = await connection.query('SELECT fullname, username, email, time_created FROM user');
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.getUser = async(req, res) => {
		try {
			const [rows, fields] = await connection.execute('SELECT fullname, username, email, time_created FROM user WHERE user_id=?', [req.params.user_id]);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	/* below functions are not used as middleware, used only to get user info from other module
	this is done to avoid the use of connection(db) variable outside db.js file and table modules(db IO controllers) */
	module.findUserById = async(user_id) => {
		try {
			const [rows, fields] = await connection.execute('SELECT * FROM user WHERE user_id=?', [user_id]);
			return rows[0];
		} catch (error) {
			return error;
		}
	};

	module.findUserByUsername = async (username) => {
		try {
			const [rows, fields] = await connection.execute('SELECT * FROM user WHERE username =?', [username]);
			return rows[0];
		} catch(error) {
			return error;
		}
	}

	return module;
};
