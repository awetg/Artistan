const router = require('express').Router();
const upload = require('../../modules/multer');
const db = require('../database/db');
const passport = require('../../modules/passport-config');


/* get all users with info at GET: base_url/api/auth/ */
router.get('/', db.Auth.getAllUsers);

/* get single user info at GET: base_url/api/auth/:user_id */
router.get('/:user_id', db.Auth.getUser);

/* register a user  POST: base_url/api/auth/register  */
router.post('/register', upload.single(), db.Auth.register);

/* login a user  POST: base_url/api/auth/login  */
router.post('/login', upload.single(), db.Auth.logIn);

/* logout a user with authentication  POST: base_url/api/auth/logout  */
// router.post('/logout', passport.authenticate('jwt', {session: false}), upload.single(), db.Auth.logOut);

/*update user ifno with authentication at PATCH: base_url/api/auth/:user_id  */
router.patch('/:user_id', passport.authenticate('jwt', {session: false}), upload.single(), db.Auth.updateUser);

/* delete a user with authentication  at DELETE: base_url/api/auth/:user_id */
router.delete('/:user_id', passport.authenticate('jwt', {session: false}), db.Auth.deleteUser);

module.exports = router;