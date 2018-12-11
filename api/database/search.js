/* This is controller module for searching content
* This module performs select operation to database on different tables
*/
'use strict';

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
				const [r, _] = await connection.query('SELECT * FROM user WHERE username=?', [req.query.keywordName]);
				console.log(r);
				res.send(r);
			} catch (error) {
				res.status(401).json(error);
			}
		}
	};

	module.searchVariant = async(req, res) => {
		try {
			const query = `SELECT post.*, username, fullname, media.path, media.mimetype, media.time_created AS post_time, media.image_ratio, avatar.path AS avatar_path,
				(SELECT COUNT(1) FROM likes_post WHERE likes_post.post_id=post.post_id) AS likes,
				(SELECT COUNT(1) FROM comment WHERE parent_post=post.post_id) AS comments,
				(SELECT GROUP_CONCAT(name) FROM post_category JOIN category ON post_category.category_id=category.category_id WHERE post_category.post_id=post.post_id) AS post_category
				FROM post INNER JOIN media ON media.media_id=post.media INNER JOIN user ON user.user_id=post.owner 
				LEFT JOIN avatar ON user.user_id=avatar.user_id WHERE post.title LIKE ?`;
			const queryParams = '%' + req.params.search_query + '%';
			const posts = connection.execute(query, [queryParams]).then(([rows, fileds]) => rows);
			const users = connection.execute('SELECT user_id, fullname, username, time_created FROM user WHERE username LIKE ? OR fullname LIKE ?', [queryParams, queryParams]).then(([rows, fileds]) => rows);
			Promise.all([posts, users]).then((results) => res.send({
				posts: results[0],
				users: results[1]
			}));
		} catch (error) {
			res.send(error);
		}
	};

	return module;
};
