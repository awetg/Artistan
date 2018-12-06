const router = require('express').Router();
const upload = require('../../modules/multer');
const db = require('../database/db');

// get list of all media files at GET:base_url/api/media
router.get('/', db.Media.getAllFiles);

//upload a file with authentication token at POST:base_url/api/media
router.post('/', db.Auth.authenticate, upload.single('my-media'), db.Media.uploadFile,(req, res) => {
	req.insertedFile.error ? res.status(401).json(req.insertedFile.message) : res.send(req.insertedFile.rows);
});

//get list of all files for a user at GET:base_url/api/media/user and must provide authentication token
router.get('/user', db.Auth.authenticate, db.Media.getMediaByUser);

// get single file using id of file at GET:base_url/api/media/fileId without authentication
router.get('/:fileId',db.Media.getFileById);

router.patch('/:fileId', (req, res) => res.status(200).json({fileId: 'updated media ' + req.params.fileId}));

//delete file with fileId and authentication token at DELETE:base_url/api/media/fileId
router.delete('/:fileId', db.Auth.authenticate, db.Media.deleteFileById);

module.exports = router;
