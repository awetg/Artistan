const passport = require('passport');
const {ExtractJwt} = require('passport-jwt'); // for extrancting jwt, using this instead of implementing ourselves
const JwtStrategy = require('passport-jwt').Strategy;
const db = require('../api/database/db');	//get database to check if user info


//set passport startegy
passport.use(new JwtStrategy({
	secretOrKey: process.env.JWT_SECRET_KEY,	//give the secretkey used to sign to jwt token
	jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),	//set from where the token will be extracted on request and name of token
}, async (userData, next) => {
	try {
		//get user info to check if user info like is user is admin
		const userRows = await db.Auth.findUser(userData.user_id);
		if(!userRows) {
			return next(null, false);	//user not found
		} else if(userRows.admin == 1) {
			userData.admin_privileges = true;	//add admin prigileges to userData if user is admin
		}

		next(null, userData);	//otherwise return userData
	} catch(error) {
		next(error, false);	//passing error to next middleware func
	}
}));

module.exports = passport;