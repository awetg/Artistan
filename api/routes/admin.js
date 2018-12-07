const router = require('express').Router();
const db = require('../database/db');

/* get all flagged post ordered by flag number with admin authenticaion at GET: base_url/api/admin */
router.get('/', db.Auth.authenticateAdmin, db.Post.getFlaggedPosts);

/* delete post with admin authenticaion at GET: base_url/api/admin/post/:post_id 
* when post is deleted it is cascaded to media table
**/
router.delete('/post/:post_id', db.Auth.authenticateAdmin, db.Post.delete);

/* delete comment with admin authenticaion at GET: base_url/api/admin/comment/comment_id */
router.delete('/comment/:comment_id', db.Auth.authenticateAdmin, db.Comment.deleteComment);


module.exports = router;
