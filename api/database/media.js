const fs = require('fs');
const util = require('util');
const deleteFile = util.promisify(fs.unlink);

module.exports = (connection) => {
	const module = {};
	module.uploadFile = async (req, res) => {
		if(req.loggedIn && req.file) {
			const query = 'INSERT INTO media (filename, path, mimetype, encoding, owner) VALUES(?, ?, ?, ?, ?)';
			const queryParams = [req.file.filename, req.file.path, req.file.mimetype, req.file.encoding, req.userData.user_id];
			const [rows, fields] = await connection.execute(query,queryParams).catch(error => res.send({error}));
			res.status(201).json({message: 'File uploaded'});
		} else {
			res.status(401).json({message:'Unautherized. Authentication required.'});
		}
	};

	module.getMediaByUser = async (req, res) => {
		if(req.loggedIn) {
			const query = 'SELECT media_id,filename,path FROM media WHERE owner=?';
			const [rows, fields] = await connection.execute(query,[req.userData.user_id]).catch(error => res.send({error}));
			res.send(rows);
		} else {
			res.status(401).json({message:'Unautherized authentication required.'});
		}
	};

	module.getAllFiles = async (req, res) => {
		const [rows, fields] = await connection.execute('SELECT path FROM media').catch(error => res.send({error}));
		res.send(rows);
	},

	module.deleteFileById = async (req, res) => {
		if(req.loggedIn) {
			if(req.params.fileId == 'undefined') res.send({message: 'File id not provided.'});
			const query = 'SELECT filename FROM media WHERE media_id=? AND owner=?';
			const [rows, fields] = await connection.query(query,[req.params.fileId, req.userData.user_id]).catch(error => res.send({error}));
			const deleteQuery = 'DELETE FROM media WHERE media_id=?';
			//delete file from disk and database at same time
			await Promise.all(
				[deleteFile('uploads/' + rows[0].filename),
				connection.query(deleteQuery, req.params.fileId)]
				).catch(errors => res.send({errors}));
			res.send({message: 'Media deleted.'})
		} else {
			res.status(401).json({message:'Unautherized. authentication required.'})
		}
	};

	module.getFileById = async (req, res) => {
		const query = 'SELECT path FROM media WHERE media_id=?';
		const [rows, fields] = await connection.query(query, req.params.fileId).catch(error => res.send({error}));
		res.send(rows);
	};

	return module;
}