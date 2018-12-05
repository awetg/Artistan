const router = require('express').Router();
const db = require('../database/db');

//test route for GET:base_url/api/users may be used to get list of users if needed
router.get('/', (req, res) => {
	res.send('auth api');
});

// create new user route ar POST:base_url/api/users, this fields come as application/x-www-form-urlencoded
router.post('/',db.User.signUp);

// login route this route is at POST:base_url/api/users/login, this fields come as application/x-www-form-urlencoded
router.post('/login',db.User.logIn);

//request user information at GET:base_url/api/users/:user_id
router.get('/:user_id', db.User.isLoggedIn, (req, res) => {
	if (req.params.user_id.toString() === req.userData.user_id.toString()) {
		res.send(req.userData);
	} else {
		res.status(403).json({message: 'Unautheraized access. Incorrect user id.'});
	}
});

module.exports = router;
