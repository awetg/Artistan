/* This routes will expose user contents to be moderated by admin accounts
* There won't be admin registeration/signup routes for security reason,
* but admin accounts can be registered using another admin account
* admin account can login using reqular login routes and access admin routes by manual writing the url
*/
const router = require('express').Router();
const upload = require('../../modules/multer');
const db = require('../database/db');

/* get all flagged post ordered by flag number with admin authenticaion at GET: base_url/api/admin */
router.get('/', db.Auth.authenticateAdmin, db.Post.getFlaggedPosts);

/* register admin account with admin authentication at POST: base_utl/api/admin/register*/
router.post('/register', db.Auth.authenticateAdmin, upload.single(), db.Auth.registerAdmin);

/* delete post with admin authenticaion at GET: base_url/api/admin/post/:post_id
* when post is deleted it is cascaded to media table and other tables
*/
router.delete('/post/:post_id', db.Auth.authenticateAdmin, db.Post.delete);

/* delete comment with admin authenticaion at GET: base_url/api/admin/comment/comment_id */
router.delete('/comment/:comment_id', db.Auth.authenticateAdmin, db.Comment.deleteComment);

module.exports = router;
