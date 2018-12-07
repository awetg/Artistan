const router = require('express').Router();
const upload = require('../../modules/multer');
const db = require('../database/db');
const passport = require('../../modules/passport-config');




/* get all follower at GET: base_url/api/follower/ */
router.get('/:user_id', db.Follower.getAllFollowers);

/*add follower: base_url/api/follower/  */
router.post('/:to_user_id', passport.authenticate('jwt', {session: false}), db.Follower.addFollower);

/* delete follower by follower id: base_url/api/follower/:follower_id */
router.delete('/:to_user_id', passport.authenticate('jwt', {session: false}), db.Follower.deleteFollower);

module.exports = router;