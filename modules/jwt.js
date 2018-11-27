const jwt = require('jsonwebtoken');

const signToken = (userData, res) => {
	//get first row from results and sign a token asynchronously
	if (userData) {
		jwt.sign({userData}, 'shhh', (error, token) => {
			if (!error) {
				res.send({
					message: 'Logged in successfully',
					token: token,
					user: {
						user_id: userData.user_id,
						username: userData.username,
						email: userData.email,
						time_created: userData.time_created
					}
				});
			} else {
				res.send({message: 'Something went wrong. JWT'});
			}
		});
	} else {
		res.send({message: 'Username or password is incorrect.'});
	}
};

const verifyToken = (token , req, res) => {
	//verify token with jwt
	jwt.verify(token, 'shhh', (error, userData) => {
		if (error) {
			res.send(403);
		} else {
			//create loggedIn and userData property on the request object and call the callback function
			req.loggedIn = true;
			req.userData = userData.userData;
			delete req.userData.password;
		}
	});
};

module.exports = {
	signToken,
	verifyToken
};
