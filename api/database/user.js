const jwt = require('../../modules/jwt');

module.exports = (connection) => {
	const module = {};
	module.signUp = async (req, res) => {
		//check all required fileds exist
		const allFieldsExist = ['fullname', 'email', 'username','password'].every(k => (k in req.body));
		if(allFieldsExist) {
			const query = 'INSERT INTO user (fullname, email,username,password) VALUES(?,?,?,?)';
			const queryParams = [req.body.fullname, req.body.email, req.body.username, req.body.password];
			const [rows, fields] = await connection.execute(query,queryParams).catch(error => res.send(error));
			res.send(rows);
		} else {
			res.send({message: 'Require fileds not provided.'})
		}
	};

	module.isLoggedIn = (req, res,next) => {
		//get token from header in field x-access-token
		const token = req.headers['x-access-token'];
		if(typeof token !== 'undefined') {
			jwt.verifyToken(token, req, res);
		} else {
			res.send(403).json('Unautherized. Authentication required.');
		}
		next();
	};

	module.logIn = async (req, res) => {
		//check all required fileds exist
		const allFieldsExist = ['username','password'].every(k => (k in req.body));
		if(allFieldsExist) {
			const query = 'SELECT * FROM user WHERE username=? AND password=?';
			const [rows, fields] = await connection.execute(query,[req.body.username, req.body.password]).catch(error => res.send(error));
			jwt.signToken(rows[0], res);
		} else {
			res.send({message: 'Required fileds not provided.'});
		}
	}

	return module;
}
