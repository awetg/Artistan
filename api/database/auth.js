const jwt = require('../../modules/jwt');

module.exports = (connection) => {
	const module = {};
	module.register = async(req, res) => {
		//check all required fields exist
		const allFieldsExist = ['fullname', 'email', 'username','password'].every(k => k in req.body);
		if (allFieldsExist) {
			try {
				const query = 'INSERT INTO user (fullname, email,username,password) VALUES(?,?,?,?)';
				const queryParams = [req.body.fullname, req.body.email, req.body.username, req.body.password];
				const [rows, fields] = await connection.execute(query,queryParams).catch(error => res.send(error));
				res.send({
					user_id: rows.insertId
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
		console.log('login route');
		if (allFieldsExist) {
			try {
				const query = 'SELECT * FROM user WHERE username=?';
				console.log('query');
				const [rows, fields] = await connection.execute(query,[req.body.username]);
				console.log('jwt');
				jwt.signToken(rows[0], res);
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			res.send({message: 'Required fields not provided.'});
		}
	};

	module.updateUser = async(req, res) => {
		//check all required fields exist
		const allFieldsExist = ['fullname', 'email', 'username','password'].every(k => k in req.body);

		if (allFieldsExist && req.user) {
			try {
				const query = 'UPDATE user SET fullname=?, email=?, username=?, password=? WHERE user_id=?';
				const queryParams = [req.body.fullname, req.body.email, req.body.username, req.body.password, req.params.user_id];
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
		console.log(req.user);
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

	/*this function is not used as middleware, used only to get user info from other module
	this is done to avoid the use of connection(db) variable outside db.js file and table modules(db IO controllers) */
	module.findUser = async(user_id) => {
		try {
			const [rows, fields] = await connection.execute('SELECT * FROM user WHERE user_id=?', [user_id]);
			return rows[0];
		} catch (error) {
			return error;
		}
	};

	return module;
};
