const router = require('express').Router();
const upload = require('../../modules/multer');
const db = require('../database/db');

/* get all posts at GET: base_url/api/post */
router.get('/', db.Post.getAllPosts);

/*create post with authentication at POST: base_url/api/post  */
router.post('/', db.Auth.authenticate, upload.single('my-media'), db.Media.uploadFile, db.Post.createPost);

/*like a post with authentication at POST: base_url/api/post/:post_id/like  */
router.post('/:post_id/like', db.Auth.authenticate, db.Post.like);

/*get all posts by user at GET: base_url/api/post/:user_id */
router.get('/:user_id/user', db.Post.getAllByUser);

/*get all posts by category at GET: base_url/api/post/:category_id/category */
router.get('/:category_id/category', db.Post.getAllByCategory);

/* delete post by post id at DELETE: base_url/api/post/:post_id */
router.delete('/:post_id', db.Auth.authenticate, db.Post.delete);

/*comment on post with authentication at POST: base_url/api/post/:post_id/comment  */
// router.post('/:post_id/comment',  db.User.isLoggedIn,db.Post.comment);

module.exports = router;
