const router = require('express').Router();
const upload = require('../../modules/multer');
const db = require('../database/db');

/* get all posts at GET: base_url/api/post */
router.get('/', db.Post.getAllPosts);

/* get single posts by id at GET: base_url/api/post
* Getting post details don't need authentication,
* but if user provide token while asking for single post details information whether user liked/flagged the post is returned as well
*/
router.get('/:post_id', db.Post.getPostById);

/*create post with authentication at POST: base_url/api/post  */
router.post('/', db.Auth.authenticate, upload.single('my-media'), db.Media.uploadFile, db.Post.createPost);

/* get all post odered by number of likes, comments and post time at the same time at GET: base_url/api/post/trending */
router.get('/trending/all', db.Post.trending);

/* get all post odered by number of likes at GET: base_url/api/post/like/all */
router.get('/like/all', db.Post.getPostByLike);

/*like a post with authentication at POST: base_url/api/post/:post_id/like  */
router.post('/:post_id/like', db.Auth.authenticate, db.Post.like);

/* Unlike a post with authentication at DELETE: base_url/api/post/:post_id/like */
router.delete('/:post_id/like', db.Auth.authenticate, db.Post.deleteLike);

/* get flagged post is only for admin accounts and can be accessed with admin accounts check admin route*/

/*flag a post with authentication at POST: base_url/api/post/:post_id/flag  */
router.post('/:post_id/flag', db.Auth.authenticate, db.Post.flag);

/* Unflag a post with authentication at DELETE: base_url/api/post/:post_id/flag */
router.delete('/:post_id/flag', db.Auth.authenticate, db.Post.deleteFlag);

/*get all posts by a user at GET: base_url/api/post/:user_id */
router.get('/:user_id/user', db.Post.getAllByUser);

/*get all posts by category at GET: base_url/api/post/:category_id/category */
router.get('/:category_id/category', db.Post.getAllByCategory);

/* delete post by post id at DELETE: base_url/api/post/:post_id */
router.delete('/:post_id', db.Auth.authenticate, db.Post.delete);

/* NOTE: commenting on a post is done through comment routes
* comment routes will be merged to post routes in the future
*/
/*comment on post with authentication at POST: base_url/api/post/:post_id/comment  */
// router.post('/:post_id/comment',  db.User.isLoggedIn,db.Post.comment);

module.exports = router;
