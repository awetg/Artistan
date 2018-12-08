/* This is controller module for user profile data
* This module performs CRUDE operation to database on different tables to get user info or updated user info
*/
module.exports = (connection) => {
	const module = {};
	module.getAllUsers = async(req, res) => {
		try {
			/* Get all user insensitive information like username joined date, number of post and total likes
			* This profile information is public and  provide without authentication
			*/
			const query = `SELECT user.user_id, username, time_created, path as avatar_path,
				(SELECT COUNT(1) FROM post WHERE owner=user.user_id) AS total_posts,
				(SELECT COUNT(1) FROM follower WHERE followed_id=user.user_id) AS followers,
				(SELECT COUNT(1) FROM likes_post WHERE post_id IN (SELECT post_id FROM post WHERE owner=user.user_id)) AS likes
				FROM user LEFT JOIN avatar ON user.user_id=avatar.user_id`;
			const [rows, _] = await connection.query(query);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.getUser = async(req, res) => {
		try {
			/* Get single user insensitive information like username joined date, number of post and total likes
			* This profile information is public and  provide without authentication
			*/
			const query = `SELECT user.user_id, fullname, username, time_created, path AS avatar_path,
				(SELECT COUNT(1) FROM post WHERE owner=user.user_id) AS total_posts,
				(SELECT COUNT(1) FROM follower WHERE followed_id=user.user_id) AS followers,
				(SELECT COUNT(1) FROM likes_post WHERE post_id IN (SELECT post_id FROM post WHERE owner=user.user_id)) AS likes
				FROM user LEFT JOIN avatar ON user.user_id=avatar.user_id WHERE user.user_id=?`;
			const [rows, _] = await connection.execute(query, [req.params.user_id]);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.uploadAvatar = async(req, res) => {
		if (req.user) {
			try {
				const [rows,, _] = await connection.execute('SELECT * FROM avatar WHERE user_id=?', [req.user.user_id]);
				if (rows.length > 0) {
					const query = 'UPDATE avatar SET path=?, mimetype=?, encoding=? WHERE user_id=?';
					await connection.query(query,[req.file.path, req.file.mimetype, req.file.encoding, req.user.user_id]);
					res.send({message: 'Avatar updated successfully', avatar_path: req.file.path});
				} else {
					const query = 'INSERT INTO avatar (user_id, path, mimetype, encoding) VALUES(?, ?, ?, ?)';
					const queryParams = [req.user.user_id, req.file.path, req.file.mimetype, req.file.encoding];
					await connection.execute(query, queryParams);
					res.send({message: 'Avatar uploaded successfully', avatar_path: req.file.path});
				}

			} catch (error) {
				res.status(401).json(error);
			}
		}
	};
	/* NOTE: this function is not used anymore inserting and updating user avatar is done with uploadAvatar function from same route with POST */
	module.updateAvatar = async(req, res) => {
		try {
			const query = 'UPDATE avatar SET path=?, mimetype=?, encoding=? WHERE user_id=?';
			const [rows, _] = await connection.query(query,[req.file.path, req.file.mimetype, req.file.encoding, req.user.user_id]);
			rows.affectedRows ? res.send({message: 'Avatar updated.', avatar_path: req.file.path}) : res.send({message: 'Avatar does not exist.'});
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.getUserAvatar = async(req, res) => {
		try {
			const [rows, _] = await connection.query('SELECT * FROM avatar WHERE user_id=?', [req.params.user_id]);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	return module;
};
