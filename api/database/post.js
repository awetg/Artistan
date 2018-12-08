/* This is controller module for post related data
* This module performs CRUDE operation to database on different tables
*/
module.exports = (connection) => {
	const module = {};
	module.createPost = async(req, res) => {
		//check if media was uploaded to db successfully, comming from upload media middleware
		if (!req.insertedFile.error) {
			if (!req.user) {res.send({message: 'Unautherized authentication required.'});}
			try {
				/* Categories are provide as array since a post can belong in multiple categories */
				const categories = JSON.parse(req.body.category);
				if (!Array.isArray(categories)) {
					return res.send({error: 'categories format is incorrect.It must be in array format.'});
				}
				/* A sequential database insertion is performed because data from first insert is used for the second one*/
				const query = 'INSERT INTO post (title, media, owner) VALUES(?, ?, ?)';
				const queryParams = [req.body.title, req.insertedFile.rows.insertId, req.user.user_id];
				const [rows, _] = await connection.execute(query, queryParams);
				const q = 'INSERT INTO post_category (post_id, category_id) VALUES ?';
				const qparams = categories.map(category => [rows.insertId, category]);
				await connection.query(q, [qparams]);
				return res.send({
					post_id: rows.insertId,
					post_path: req.file.path,
					message: 'New post created successfully!'
				});
			} catch (error) {
				return res.status(401).json(error);
			}
		} else {
			return res.status(401).json(req.insertedFile.error);
		}
	};

	module.like = async(req, res) => {
		if (req.user) {
			try {
				const query = 'INSERT INTO likes_post (user_id, post_id) VALUES(?, ?)';
				const [rows, _] = await connection.execute(query,[req.user.user_id, req.params.post_id]);
				rows.affectedRows ? res.send({message: 'Posted liked'}) : res.send({message: 'Post does not exist.'});
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			res.send({message: 'Unautherized.'});
		}
	};

	module.deleteLike = async(req, res) => {
		if (req.user) {
			try {
				const [rows, _] = await connection.query('DELETE FROM likes_post WHERE post_id=? and user_id=?', [req.params.post_id, req.user.user_id]);
				rows.affectedRows ? res.send({message: 'Posted unliked.'}) : res.send({message: 'Post does not exist or you do not have permission to do the operation.'});
				// const [rows, _] = await connection.query('DELETE FROM likes_post WHERE post_id=?', [req.params.post_id]);
				// rows.affectedRows ? res.send({message: 'Posted unliked.'}) : res.send({message: 'Post does not exist.'});
			} catch (error) {
				res.send(error);
			}
		} else {
			res.send({message: 'Unautherized'});
		}
	};

	module.getAllPosts = async(req, res) => {
		try {
			//get all posts
			const query = `SELECT post.*, username, fullname, media.path, media.mimetype, media.time_created AS post_time, avatar.path AS avata_path,
				(SELECT COUNT(1) FROM likes_post WHERE likes_post.post_id=post.post_id) AS likes,
				(SELECT COUNT(1) FROM comment WHERE parent_post=post.post_id) AS comments,
				(SELECT GROUP_CONCAT(name) FROM post_category JOIN category ON post_category.category_id=category.category_id WHERE post_category.post_id=post.post_id) AS post_category
				FROM post INNER JOIN media ON media.media_id=post.media INNER JOIN user ON user.user_id=post.owner 
				LEFT JOIN avatar ON user.user_id=avatar.user_id`;
			const [rows,_] = await connection.execute(query);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.getPostById = async(req, res) => {
		try {
			const query = `SELECT post.*, username, fullname, media.path, media.mimetype, media.time_created AS post_time, avatar.path AS avatar_path,
				(SELECT COUNT(1) FROM likes_post WHERE likes_post.post_id=post.post_id) AS likes,
				(SELECT COUNT(1) FROM comment WHERE parent_post=post.post_id) AS comments,
				(SELECT GROUP_CONCAT(name) FROM post_category JOIN category ON post_category.category_id=category.category_id WHERE post_category.post_id=post.post_id) AS post_category
				FROM post LEFT JOIN avatar ON post.owner=avatar.user_id INNER JOIN media ON media.media_id=post.media 
				INNER JOIN user ON user.user_id=post.owner WHERE post.post_id=?`;
			const [rows, _] = await connection.execute(query, [req.params.post_id]);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	}

	module.getAllByUser = async(req, res) => {
		try {
			const query = `SELECT post.*, username, fullname, media.path, media.mimetype, media.time_created AS post_time, avatar.path AS avatar_path,
				(SELECT COUNT(1) FROM likes_post WHERE likes_post.post_id=post.post_id) AS likes,
				(SELECT COUNT(1) FROM comment WHERE parent_post=post.post_id) AS comments,
				(SELECT GROUP_CONCAT(name) FROM post_category JOIN category ON post_category.category_id=category.category_id WHERE post_category.post_id=post.post_id) AS post_category
				FROM post LEFT JOIN avatar ON post.owner=avatar.user_id INNER JOIN media ON media.media_id=post.media 
				INNER JOIN user ON user.user_id=post.owner WHERE post.owner=? ;`;
			const [rows, _] = await connection.execute(query, [req.params.user_id]);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.getAllByCategory = async(req, res) => {
		try {
			const [postIds, _] = await connection.execute('SELECT post_id FROM post_category WHERE category_id=?', [req.params.category_id]);
			if (postIds.length > 0) {
				const query = `SELECT post.*, username, fullname, media.path, media.mimetype, media.time_created AS post_time, avatar.path AS avata_path,
				(SELECT COUNT(1) FROM likes_post WHERE likes_post.post_id=post.post_id) AS likes
				(SELECT COUNT(1) FROM comment WHERE parent_post=post.post_id) AS comments,
				(SELECT GROUP_CONCAT(name) FROM post_category JOIN category ON post_category.category_id=category.category_id WHERE post_category.post_id=post.post_id) AS post_category
				FROM post LEFT JOIN avatar ON post.owner=avatar.user_id INNER JOIN media ON media.media_id=post.media INNER JOIN user ON user.user_id=post.owner WHERE post.post_id IN  ( `;
				const [rows, unused] = await connection.execute(query + postIds.map(p => p.post_id) + ' ) ');
				res.send(rows);
			} else {
				res.send([]);
			}
		} catch (error) {
			res.status(error).json(error);
		}
	};

	module.delete = async(req, res) => {
		if (req.user) {
			try {
				const query = req.user.admin_privileges ? 'DELETE FROM post WHERE post_id=?' : 'DELETE FROM post WHERE post_id=? AND owner=?';
				const queryParams = req.user.admin_privileges ? [req.params.post_id] : [req.params.post_id, req.user.user_id];
				[rows, _] = await connection.query(query, queryParams);
				rows.affectedRows ? res.send({message: 'Post delted.'}) : res.send({message: 'Post does not exist or you don not have permission to delete'});
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			res.send({message: 'Unautherized authentication required.'});
		}
	};

	module.getFlaggedPosts = async(req, res) => {
		if (req.user.admin_privileges) {
			try {
				const query = `SELECT post.*, username, fullname, media.path, media.mimetype, media.time_created AS post_time, avatar.path AS avata_path,
					(SELECT COUNT(1) FROM likes_post WHERE likes_post.post_id=post.post_id) AS likes,
					(SELECT COUNT(1) FROM comment WHERE parent_post=post.post_id) AS comments,
					(SELECT GROUP_CONCAT(name) FROM post_category JOIN category ON post_category.category_id=category.category_id WHERE post_category.post_id=post.post_id) AS post_category
					FROM post INNER JOIN media ON media.media_id=post.media INNER JOIN user ON user.user_id=post.owner 
					LEFT JOIN avatar ON user.user_id=avatar.user_id WHERE flag > 0 ORDER BY flag DESC`;
				const [rows, _] = await connection.execute(query);
				res.send(rows);
			} catch (error) {
				res.status(401).json(error);
			}
		}
	};

	return module;
};
