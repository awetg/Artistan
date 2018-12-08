/* This is controller module for searching content
* This module performs select operation to database on different tables
*/
module.exports = (connection) => {
	const module = {};

	module.search = async(req, res) => {
		if (req.query.keywordTitle) {
			try {
				const [r, _] = await connection.query('SELECT media.*, username, fullname FROM post INNER JOIN media ON media.media_id=post.media INNER JOIN user ON user.user_id=post.owner WHERE title=?', [req.query.keywordTitle]);
				console.log(r);
				res.send(r);
			} catch (error) {
				res.status(401).json(error);
			}
		}

		if (req.query.keywordName) {
			try {
				const [r, _] = await connection.query('SELECT * FROM post WHERE title=?', [req.query.keywordName]);
				console.log(r);
				res.send(r);
			} catch (error) {
				res.status(401).json(error);
			}
		}
	};

	module.searchVariant = async(req, res) => {
		try {
			const query = `SELECT post.*, username, fullname, media.*, media.time_created as post_time, avatar.path as avata_path,
				(SELECT COUNT(1) FROM likes_post WHERE likes_post.post_id=post.post_id group by post_id) as likes 
				FROM post INNER JOIN media ON media.media_id=post.media INNER JOIN user ON user.user_id=post.owner 
				LEFT JOIN avatar ON user.user_id=avatar.user_id WHERE title LIKE ?`;
			const queryParams = '%' + req.params.search_query + '%';
			const posts = connection.execute(query, [queryParams]).then(([rows, fileds]) => rows);
			const users = connection.execute('SELECT user_id, fullname, username, time_created FROM user WHERE username LIKE ? OR fullname LIKE ?', [queryParams, queryParams]).then(([rows, fileds]) => rows);
			Promise.all([posts, users]).then((results) => res.send(results));
		} catch (error) {
			res.send(error);
		}
	};
	return module;
};
