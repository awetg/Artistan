const router = require('express').Router();
const upload = require('../../modules/multer');
const db = require('../database/db');
const passport = require('../../modules/passport-config');

/* get all comments for a post at GET: base_url/api/comment/:post_id */
router.get('/:post_id', db.Comment.getAllComments);

/*create a comment with authentication at POST: base_url/api/comment/:post_id  */
router.post('/:post_id', passport.authenticate('jwt', {session: false}),upload.single(), db.Comment.createComment);

/*update a comment with authentication at PATCH: base_url/api/comment/:comment_id  */
router.patch('/:comment_id', passport.authenticate('jwt', {session: false}),upload.single(), db.Comment.updateComment);

/* delete comment by post id at DELETE: base_url/api/comment/:comment_id */
router.delete('/:comment_id', passport.authenticate('jwt', {session: false}), db.Comment.deleteComment);

module.exports = router;