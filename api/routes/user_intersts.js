const router = require('express').Router();
const upload = require('../../modules/multer');
const db = require('../database/db');


/* get all category at GET: base_url/api/user_interested */
router.get('/', db.Auth.authenticate, db.User_Interested.getAllInterests);

/*add category at POST: base_url/api/user_interested  */
router.post('/:category_id', db.Auth.authenticate, db.User_Interested.addInterest);

/* delete category by category id with authentication at DELETE: base_url/api/user_interested/:intersts */
router.delete('/:category_id', db.Auth.authenticate, db.User_Interested.deleteInterest);

module.exports = router;