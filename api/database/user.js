const jwt = require('../../modules/jwt');

module.exports = (connection) => {
	const module = {};
	module.signUp = (req, res) => {
		// this fields come as application/x-www-form-urlencoded
		if(req.body) {
			const body = req.body
			const signUpFields = ['fullname', 'email', 'username','password'];
			const allFieldsExist = signUpFields.every(k => (k in body));
			if(allFieldsExist)  {
				connection.execute('INSERT INTO user (fullname, email,username,password) VALUES(?,?,?,?)',
					[body.fullname, body.email, body.username, body.password],
					(error, results, fields) => {
						error ? res.send({error}) : res.send(results);
					})
			} else {
				res.send({message: 'require fileds not submitted.'})
			}
		} else {
			res.send({message: 'Empty form.'})
		}
	};

	module.isLoggedIn = (req, res,cb) => {
		//get token from header in field x-access-token
		const token = req.headers['x-access-token']
		
		if(typeof token !== 'undefined') {
			jwt.verifyToken(token, req, res)
		} else {
			res.send(403).json('Unautheraized access.')
		}
		cb();
	};

	module.logIn = (req, res) => {
		// this fields come as application/x-www-form-urlencoded
		if(req.body) {
			const body = req.body;
			const logInFields = ['username','password']
			const allFieldsExist = logInFields.every(k => (k in body));
			if(allFieldsExist) {
				connection.execute('SELECT * FROM user WHERE username=? AND password=?',
					[body.username, body.password],
					(error, results, fields) => {
						error ? res.send(error) : jwt.signToken(results[0], res);
					})
			} else {
				res.send({message: 'required fields not provided.'})
			}
		} else {
			res.send({message: 'required fileds not provided.'})
		}
	}

	return module;
}
