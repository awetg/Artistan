const router = require('express').Router();
const upload = require('../../modules/multer');
const db = require('../database/db');
const passport = require('../../modules/passport-config');


/* get all category at GET: base_url/api/follower/ */
router.get('/', db.Follower.getAllFollowers);

/*add category at POST: base_url/api/follower/  */
router.post('/', passport.authenticate('jwt', {session: false}), upload.single(), db.Follower.addFollower);

/* delete category by category id with authentication at DELETE: base_url/api/follower/:follower_id */
router.delete('/:follower_id', passport.authenticate('jwt', {session: false}), db.Follower.deleteFollower);

module.exports = router;