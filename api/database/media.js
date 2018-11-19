const fs = require('fs');

module.exports = (connection) => {
	const module = {};
	module.uploadFile = (req, res) => {
		if(req.loggedIn) {
		const file = req.file;
			//if file object not returned by multer file is not received
			if(!file) res.send({message: 'file not received.'});

			connection.execute('INSERT INTO media (filename, path, mimetype, encoding, owner) VALUES(?,?,?,?,?)',
				[file.filename, file.path, file.mimetype, file.encoding, req.userData.user_id],
				(error, results, fields) => {
					error ? res.send({error}) : res.status(201).json('file uploaded.');
				})
		} else {
			res.send({message: 'uploading withour logging in not allowed.'});
		}
	};

	module.getMediaByUser = (req, res) => {
		if(req.loggedIn) {
			const userId = req.userData.user_id;
			connection.execute('SELECT id,filename,path FROM media WHERE media_id=?',
				[userId],
				(error, results,fields) => error ? res.send({error}) : res.send(results));
		}
	};

	module.getAllFiles = (req, res) => connection.execute('SELECT path FROM media', (error,results, fields) => error ? res.send({error}) : res.send(results));

	module.deleteFileById = (req, res) => {
		const deleteFile = (file) => {
			fs.unlink('uploads/' + file.filename, error => {
				if(error) {
					res.status(501).json({message: 'error deleting file'});
					console.log(error);
				} else {
					connection.query('DELETE FROM media WHERE media_id=?', req.params.fileId,
						(error, results, fields) => {
							error ? res.send({error}) : res.status(200).json({message: 'file deleted successfully.'});
						})
				}
			});
		}
		if(req.loggedIn) {
			if(req.params.fileId == 'undefined') res.send({message: 'File id not provided.'})
				connection.query('SELECT filename FROM media WHERE media_id=? AND owner=?',
					[req.params.fileId, req.userData.user_id],
					(error, results, fields) => {
						if(error) {
							res.send(error);
						} else {
							(results.length > 0 ) ? deleteFile(results[0]) : res.send({message: 'File does not exist.'});
						}
					})
		} else {
			res.status(401).json({message:'Unautherized authentication.'})
		}
	};

	module.getFileById = (req, res) => {
		connection.query('SELECT path FROM media WHERE media_id=?', req.params.fileId, 
			(error, results, fields) => error ? res.send({error}) : res.send(results));
	}

	return module;
}