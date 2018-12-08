/* Most routes in api/user handle user's public data */

const router = require('express').Router();
const upload = require('../../modules/multer');
const resize = require('../../modules/resize');
const db = require('../database/db');

/* get all users info without authentication (fullname,username,time_created )at GET: base_url/api/users/ */
router.get('/', db.User.getAllUsers);

/* get single user info without authentication (fullname,username,time_created )at GET: base_url/api/users/:user_id */
router.get('/:user_id', db.User.getUser);

/* uploading user avatar with authentication at POST: base_url/api/users/:user_id/avatar */
router.post(
	'/avatar',
	db.Auth.authenticate,
	upload.single('my-media'),
	(req, res, next) => {
		resize.doResize(req.file.path, 300, 'uploads/medium_' + req.file.filename, next);
	},
	db.User.uploadAvatar
);

router.patch(
	'/avatar',
	db.Auth.authenticate,
	upload.single('my-media'),
	(req, res, next) => {
		resize.doResize(req.file.path, 300, 'uploads/medium_' + req.file.file, next);
	},
	db.User.updateAvatar);

/* get user avatar  at GET: base_url/api/users/:user_id/avatar */
router.get('/avatar/:user_id',db.User.getUserAvatar);







/* get all followers of a user by id at GET: base_url/api/users/:user_id/followers */
router.get('/:user_id/followed', db.Follower.getAllFollowed);

/* get all following a user by id at GET: base_url/api/users/:user_id/following */
router.get('/:user_id/following', db.Follower.getAllFollowing);

/* to follow someone*/
router.post('/:user_id/follow', db.Auth.authenticate, db.Follower.addFollower)

<<<<<<< HEAD
/* get user interset at GET: base_url/users/:user_id/interset 

=======
/* get user interset at GET: base_url/users/:user_id/interset
* interest/category id should be passed as api/users/:user_id/interset/1/2/3/
* ids after interset/ will splited at '/'
>>>>>>> 0ecc982a3280add4af4edd62a60ff5855eeea8e9
*/
router.get('/:user_id/interset/',db.Auth.authenticate, db.User_Interested.getAllInterests);

// interest/category id should be passed as api/users/:user_id/interset/1/2/i3/
// ids after interset/ will splited at 
/* add user interset with authentication at POST: base_url/users/:user_id/interset */
router.post('/:user_id/interset/*', db.Auth.authenticate, db.User_Interested.addInterest);

/* get all category at GET: base_url/api/user_interested */
router.get('/:user_id/interset', db.Auth.authenticate, db.User_Interested.getAllInterests);

/*add category at POST: base_url/api/user_interested  */
router.post('/:category_id', db.Auth.authenticate, db.User_Interested.addInterest);

/* delete category by category id with authentication at DELETE: base_url/api/user_interested/:intersts */
router.delete('/:category_id', db.Auth.authenticate, db.User_Interested.deleteInterest);

module.exports = router;
