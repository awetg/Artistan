const router = require('express').Router();
const upload = require('../../modules/multer');
const db = require('../database/db');


/* get all users with info at GET: base_url/api/auth/ */
router.get('/', db.Auth.getAllUsers);	/* NOTE:  this will be re-implemented in profile.js route auth will be only for account related routes*/

/* get single user account info at GET: base_url/api/auth/:user_id */
router.get('/:user_id',  db.Auth.authenticate, db.Auth.getUser);

/* register a user  POST: base_url/api/auth/register  */
router.post('/register', upload.single(), db.Auth.register);

/* login a user  POST: base_url/api/auth/login  */
router.post('/login', upload.single(), db.Auth.logIn);
// router.post('/login', passportLogin, (req, res) =>  res.send(req.user));

/* logout a user with authentication  POST: base_url/api/auth/logout  */
router.post('/logout', db.Auth.authenticate, db.Auth.logOut);

/*update user account ifno with authentication at PATCH: base_url/api/auth/:user_id  */
router.patch('/:user_id', db.Auth.authenticate, upload.single(), db.Auth.updateUser);

/* delete a user account with authentication  at DELETE: base_url/api/auth/:user_id */
router.delete('/:user_id',  db.Auth.authenticate, db.Auth.deleteUser);

module.exports = router;