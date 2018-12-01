const fs = require('fs');
const util = require('util');
const deleteFile = util.promisify(fs.unlink);

module.exports = (connection) => {
	const module = {};
	module.uploadFile = async(req, res,next) => {
		if (req.user && req.file) {
			try {
				const query = 'INSERT INTO media (filename, path, mimetype, encoding, owner) VALUES(?, ?, ?, ?, ?)';
				const queryParams = [req.file.filename, req.file.path, req.file.mimetype, req.file.encoding, req.user.user_id];
				const [rows, fileds] = await connection.execute(query,queryParams).catch(error => {req.insertedFile.error = error;});
				req.insertedFile = {'rows': rows, error: false};
				next();
			} catch(error) {
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
			const [rows, fields] = await connection.execute(query,[req.user.user_id]);
			res.send(rows);
			} catch(error) {
				res.status(401).json(error);
			}
		} else {
			res.status(401).json({message: 'Unautherized authentication required.'});
		}
	};

	module.getAllFiles = async(req, res) => {
		try {
			const [rows, fields] = await connection.execute('SELECT path FROM media');
			res.send(rows);
		} catch(error) {
			res.status(401).json(error);
		}
	};

	module.deleteFileById = async(req, res) => {
		if (req.user) {
			try {
				if (req.params.fileId === 'undefined') {res.send({message: 'File id not provided.'});}
				const query = 'SELECT filename FROM media WHERE media_id=? AND owner=?';
				const [rows, fields] = await connection.query(query,[req.params.fileId, req.user.user_id]);
				const deleteQuery = 'DELETE FROM media WHERE media_id=?';
				/*delete file from uploads and database at same time */
				await Promise.all(
					[deleteFile('uploads/' + rows[0].filename),
					connection.query(deleteQuery, req.params.fileId)]
					).then(res.send({message: 'Media deleted.'}));
			} catch(error) {
				res.status(401).json(error);
			}
		} else {
			res.status(401).json({message: 'Unautherized. authentication required.'});
		}
	};

	module.getFileById = async(req, res) => {
		try {
			const query = 'SELECT path FROM media WHERE media_id=?';
			const [rows, fields] = await connection.query(query, req.params.fileId);
			res.send(rows);
		} catch(error) {
			res.status(401).json(error);
		}
	};

	return module;
};
