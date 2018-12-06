/* Most routes in api/user handle user's public data */

const router = require('express').Router();
const upload = require('../../modules/multer');
const resize = require('../../modules/resize');
const db = require('../database/db');

/* get all users info without authentication (fullname,username,time_created )at GET: base_url/api/users/ */
router.get('/', db.User.getAllUsers);

/* get single user info without authentication (fullname,username,time_created )at GET: base_url/api/users/:user_id */
router.get('/:user_id', db.User.getUser);

/* uploading user avatar. this is used for updating avatar as well, with authentication at POST: base_url/api/users/:user_id/avatar */
router.post(
	'/:user_id/avatar',
	db.Auth.authenticate,
	upload.single('my-media'),
	(req, res, next) => {
		resize.doResize(req.file.path, 300, 'uploads/medium_' + req.file.filename, next);
	},
	db.User.uploadAvatar
);

/* get user avatar  at GET: base_url/api/users/:user_id/avatar */
router.get('/:user_id/avatar',db.User.getUserAvatar);

/* get all followers of a user by id at GET: base_url/api/users/:user_id/followers */
// router.get('/:user_id/followers', db.User.getFollowers);

/* get all following a user by id at GET: base_url/api/users/:user_id/following */
// router.get('/:user_id/following', db.User.getFollowing);

/* get user interset at GET: base_url/users/:user_id/interset 
* interest/category id should be passed as api/users/:user_id/interset/1/2/3/
* ids after interset/ will splited at '/'
*/
// router.get('/:user_id/interset/*', db.User.getUserInterset);

/* add user interset with authentication at POST: base_url/users/:user_id/interset */
// router.post('/:user_id/interset', db.Auth.authenticate, db.User.addUserInterest);

module.exports = router;
