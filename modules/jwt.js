const jwt = require('jsonwebtoken');

const guid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
	const r = Math.random() * 16|0;
	v = c == 'x' ? r : (r & 0x3 | 0x8);
	return v.toString(16);
});

const signToken = (user) => {
	return new Promise((resolve, reject) => {
		if (user) {
			const payload = {
				exp: Math.floor(Date.now() / 1000) + (60 * 60),	//sign token with 1 hour expiration (number of seconds are set)
				user_id: user.user_id,
				jti: guid()	//token id used as key while blacklisting jwt
			};
			jwt.sign(payload, process.env.JWT_SECRET_KEY, (error, token) => {
				if (error) reject(error);
				resolve({
					message: 'Logged in successfully',
					token: token,
					user: {
						user_id: user.user_id,
						username: user.username,
						email: user.email,
						time_created: user.time_created
					}
				});
			});
		} else {
			reject({message: 'Username or password is incorrect.'});
		}
	});
};

const verifyToken = async(token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
			error ? reject(error) : resolve(user);
		});
	});
};

module.exports = {
	signToken,
	verifyToken
};
