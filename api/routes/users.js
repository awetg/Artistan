/* This routes in api/users handle user's public profile data
* All routes don't need authentication execpt POST, PATCH AND DELETE request
* Rotues such as folloer, user_interests are related with user profile but implemented separeately for development ease
*/

const router = require('express').Router();
const upload = require('../../modules/multer');
const resize = require('../../modules/resize');
const db = require('../database/db');

/* get all users info without authentication (fullname,username,time_created )at GET: base_url/api/users/ */
router.get('/', db.User.getAllUsers);

/* get single user info without authentication (fullname,username,time_created )at GET: base_url/api/users/:user_id */
router.get('/:user_id', db.User.getUser);

/* uploading user avatar with authentication at POST: base_url/api/users/avatar
* NOTE: updting user avatar is also done through this route
*/
router.post(
	'/avatar',
	db.Auth.authenticate,
	upload.single('my-media'),
	(req, res, next) => {
		resize(req.file.path, 300, 'uploads/medium_' + req.file.filename, next);
	},
	db.User.uploadAvatar
);

/* Update user avatar with authentication at PATCH: base_url/users/avatar
* NOTE: Route is depracted, use POST request to upload and update user avatar
*/
router.patch(
	'/avatar',
	db.Auth.authenticate,
	upload.single('my-media'),
	(req, res, next) => {
		resize(req.file.path, 300, 'uploads/medium_' + req.file.file, next);
	},
	db.User.updateAvatar);

/* get user avatar  at GET: base_url/api/users/:user_id/avatar */
router.get('/avatar/:user_id',db.User.getUserAvatar);

/* Below routes will bring follower routes and user_interset routes to this route (implemnted separately for development ease)*/

/* get all followers of a user by id at GET: base_url/api/users/:user_id/followers */
router.get('/:user_id/followed', db.Follower.getAllFollowed);

/* get all following a user by id at GET: base_url/api/users/:user_id/following */
router.get('/:user_id/following', db.Follower.getAllFollowing);

/* to follow someone*/
router.post('/:user_id/follow', db.Auth.authenticate, db.Follower.addFollower);

/* get user interset at GET: base_url/users/:user_id/interset */
router.get('/:user_id/interset/',db.Auth.authenticate, db.User_Interested.getAllInterests);

// interest/category id should be passed as api/users/:user_id/interset/1/2/i3/
// ids after interset/ will splited at ' /'
/* add user interset with authentication at POST: base_url/users/:user_id/interset */
router.post('/:user_id/interset/*', db.Auth.authenticate, db.User_Interested.addInterest);

/* get all category at GET: base_url/api/user_interested */
router.get('/:user_id/interset', db.Auth.authenticate, db.User_Interested.getAllInterests);

/*add category at POST: base_url/api/user_interested  */
router.post('/:category_id', db.Auth.authenticate, db.User_Interested.addInterest);

/* delete category by category id with authentication at DELETE: base_url/api/user_interested/:intersts */
router.delete('/:category_id', db.Auth.authenticate, db.User_Interested.deleteInterest);

module.exports = router;
