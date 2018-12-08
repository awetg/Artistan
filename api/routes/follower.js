const router = require('express').Router();
const upload = require('../../modules/multer');
const db = require('../database/db');




/* get all people whom this user is Following to */
router.get('/:user_id/following', db.Follower.getAllFollowing);

/* get all people who follow this user */
router.get('/:user_id/followed', db.Follower.getAllFollowed);

/*add follower: base_url/api/follower/  */
router.post('/:to_user_id', db.Auth.authenticate, db.Follower.addFollower);

/* delete follower by follower id: base_url/api/follower/:follower_id */
router.delete('/:to_user_id', db.Auth.authenticate, db.Follower.deleteFollower);

module.exports = router;