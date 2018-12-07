const router = require('express').Router();
const db = require('../database/db');

router.get('/', db.Search.search);

module.exports = router;
