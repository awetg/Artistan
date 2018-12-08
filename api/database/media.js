/* This is controller module for media data
* This module performs CRUDE operation to database on media table only
* media deleted from database are deleted from disk too if delete request comes from media routes
* deleteing a post from post table also cascades to media table but files are not deleted from disk if delete is performed from post route
* Since only post routes are used in the application media are not delted after post deletion (skipped to avoid latency)
* but the deletion from disk is implemeted here for presentation and if media route is used file is also deleted from disk
*/
const fs = require('fs');
const imageSize = require('image-size');
const util = require('util');
const deleteFile = util.promisify(fs.unlink);

module.exports = (connection) => {
	const module = {};
	module.uploadFile = async(req, res,next) => {
		if (req.user && req.file) {
			try {
				/* Get image dimension because width/height ratio is used in frontend */
				const dimension = imageSize(req.file.path);
				const imageRatio = +(dimension.width / dimension.height).toFixed(2);
				const query = 'INSERT INTO media (filename, path, mimetype, encoding, owner, image_ratio) VALUES(?, ?, ?, ?, ?, ?)';
				const queryParams = [req.file.filename, req.file.path, req.file.mimetype, req.file.encoding, req.user.user_id, imageRatio];
				const [rows, _] = await connection.execute(query,queryParams);
				req.insertedFile = {'rows': rows, error: false};
				next();
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			req.insertedFile = {message: 'Unautherized. Authentication required or file not uploaded.', error: true};
			next();
			// res.status(401).json({message:'Unautherized. Authentication required or file not uploaded.'});
		}
	};

	module.getMediaByUser = async(req, res) => {
		if (req.user) {
			try {
				const query = 'SELECT media_id,filename,path FROM media WHERE owner=?';
				const [rows, _] = await connection.execute(query,[req.user.user_id]);
				res.send(rows);
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			res.status(401).json({message: 'Unautherized authentication required.'});
		}
	};

	module.getAllFiles = async(req, res) => {
		try {
			const [rows, _] = await connection.execute('SELECT path FROM media');
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.deleteFileById = async(req, res) => {
		if (req.user) {
			try {
				if (req.params.fileId === 'undefined') {res.send({message: 'File id not provided.'});}
				const query = 'SELECT filename FROM media WHERE media_id=? AND owner=?';
				const [rows, _] = await connection.query(query,[req.params.fileId, req.user.user_id]);
				const deleteQuery = 'DELETE FROM media WHERE media_id=?';
				/*delete file from uploads and database at same time */
				await Promise.all(
					[deleteFile('uploads/' + rows[0].filename),connection.query(deleteQuery, req.params.fileId)]
				).then(res.send({message: 'Media deleted.'}));
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			res.status(401).json({message: 'Unautherized. authentication required.'});
		}
	};

	module.getFileById = async(req, res) => {
		try {
			const query = 'SELECT path FROM media WHERE media_id=?';
			const [rows, _] = await connection.query(query, req.params.fileId);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	return module;
};
