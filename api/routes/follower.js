const router = require('express').Router();
const db = require('../database/db');

/* get all follower at GET: base_url/api/follower/ */
router.get('/:user_id', db.Follower.getAllFollowers);

/*add follower: base_url/api/follower/  */
router.post('/:to_user_id', db.Auth.authenticate, db.Follower.addFollower);

/* delete follower by follower id: base_url/api/follower/:follower_id */
router.delete('/:to_user_id', db.Auth.authenticate, db.Follower.deleteFollower);

module.exports = router;
