const router = require('express').Router();

//using multer middleware for image upload
const multer = require('multer');
const db = require('../database/db');

//setting pemannet storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '__' + file.originalname);
	}
});

const upload = multer({ storage: storage });

// get list of all media files at GET:base_url/api/media
router.get('/', db.Media.getAllFiles);

//upload a file with authentication token at POST:base_url/api/media
router.post('/', db.User.isLoggedIn, upload.single('my-media'), db.Media.uploadFile);

//get list of all files for a user at GET:base_url/api/media/user and must provide authentication token
router.get('/user',db.User.isLoggedIn, db.Media.getMediaByUser);

// get single file using id of file at GET:base_url/api/media/fileId without authentication
router.get('/:fileId',db.Media.getFileById);

router.patch('/:fileId', (req, res) => res.status(200).json({fileId: 'updated media ' + req.params.fileId}));

//delete file with fileId and authentication token at DELETE:base_url/api/media/fileId
router.delete('/:fileId',db.User.isLoggedIn, db.Media.deleteFileById);

module.exports = router;
