//using multer middleware for image upload
const multer = require('multer');

//setting pemannet storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null,  Date.now() + '__' + file.originalname);
	}
});

const upload = multer({ storage: storage });

module.exports = upload;