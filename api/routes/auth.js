/* This routes handle sensitive account related data and authentication
*All routes execpt creating account need authentication to access
*/
const router = require('express').Router();
const upload = require('../../modules/multer');
const db = require('../database/db');

/* get single user account info (all info except password) with authentication at GET: base_url/api/auth/:user_id */
router.get('/:user_id', db.Auth.authenticate, db.Auth.getUser);

/* register a user  POST: base_url/api/auth/register  */
router.post('/register', upload.single(), db.Auth.register);

/* login a user  POST: base_url/api/auth/login  */
router.post('/login', upload.single(), db.Auth.logIn);

/* logout a user with authentication  POST: base_url/api/auth/logout  */
router.post('/logout', db.Auth.authenticate, db.Auth.logOut);

/* update user account ifno with authentication at PATCH: base_url/api/auth/:user_id
* This route will update user account info like fullname, email or password whatever is provide or uploaded
*/
router.patch('/:user_id', db.Auth.authenticate, upload.single(), db.Auth.updateUser);

/* delete a user account with authentication  at DELETE: base_url/api/auth/:user_id */
router.delete('/:user_id', db.Auth.authenticate, db.Auth.deleteUser);

/* Change username if availabe at PATCH: base_url/api/auth/:user_id */
router.patch('/:user_id/username', db.Auth.authenticate, upload.single(), db.Auth.changeUsername);

module.exports = router;
