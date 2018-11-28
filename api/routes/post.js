const router = require('express').Router();
const upload = require('../../modules/multer');
const db = require('../database/db');

/* get all posts at GET: base_url/api/post */
router.get('/', db.Post.getAllPosts);

/*create post with authentication at POST: base_url/api/post  */
router.post('/', db.User.isLoggedIn, upload.single('my-media'), db.Media.uploadFile, db.Post.createPost);

/*like a post with authentication at POST: base_url/api/post/:post_id/like  */
router.post('/:post_id/like', db.User.isLoggedIn,db.Post.like);

/*comment on post with authentication at POST: base_url/api/post/:post_id/comment  */
router.post('/:post_id/comment', db.User.isLoggedIn,db.Post.comment);

module.exports = router;
