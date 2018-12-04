const router = require('express').Router();
const upload = require('../../modules/multer');
const db = require('../database/db');
const passport = require('../../modules/passport-config');

router.post('/', passport.authenticate('jwt', {session: false}), upload.single(), db.Search.searchAPost);

module.exports = router;