
module.exports = (connection) => {
	const module = {};
	module.getAllUsers = async(req, res) => {
		try {
			const [rows, fields] = await connection.query('SELECT userid, fullname, username, time_created FROM user');
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.getUser = async(req, res) => {
		try {
			const [rows, fields] = await connection.execute('SELECT user_id, fullname, username, time_created FROM user WHERE user_id=?', [req.params.user_id]);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.uploadAvatar = async (req, res) => {
		try {
			const query = 'INSERT INTO avatar (user_id, path, mimetype, encoding) VALUES(?, ?, ?, ?)';
			const queryParams = [req.params.user_id, req.file.path, req.file.mimetype, req.file.encoding];
			const [rows, fields] = await connection.execute(query, queryParams);
			res.send({message: 'Avatar uploaded successfully', path: req.file.path});

		} catch(error) {
			res.status(401).json(error);
		}
	}

	module.getUserAvatar = async (req, res) => {
		try {
			const [rows, fields] = await connection.query('SELECT * FROM avatar WHERE user_id=?', [req.params.user_id]);
			res.send(rows);
		} catch(error) {
			res.status(401).json(error);
		}
	}


	return module;
};
