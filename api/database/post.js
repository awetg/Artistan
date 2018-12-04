module.exports = (connection) => {
	const module = {};
	module.createPost = async(req, res) => {
		//check if media was uploaded to db successfully
		if (!req.insertedFile.error) {
			if (!req.user) {res.send({message: 'Unautherized authentication required.'});}
			try {
				console.log('createPost');
				const query = 'INSERT INTO post (title, media, owner) VALUES(?, ?, ?)';
				const queryParams = [req.body.title, req.insertedFile.rows.insertId, req.user.user_id];
				const [rows, fields] = await connection.execute(query, queryParams);
				const categories = JSON.parse(req.body.category);
				let q = 'INSERT INTO post_category (post_id, category_id) VALUES ?';
				const qparams = categories.map(category => [rows.insertId, category]);
				await connection.query(q, [qparams]);
				res.send(rows);
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			res.status(401).json(req.insertedFile.error);
		}
	};

	module.like = async(req, res) => {
		if (req.user) {
			try {
				const query = 'INSERT INTO likes_post (user_id, post_id) VALUES(?, ?)';
				const [rows,fields] = await connection.execute(query,[req.user.user_id, req.params.post_id]);
				res.send({message: 'Posted liked'});
			} catch (error) {
				res.status(401).json(error);
			}
		}
	};

	module.getAllPosts = async(req, res) => {
		try {
			//get all posts
			const query = 'SELECT * FROM post INNER JOIN media ON media.media_id=post.media INNER JOIN user ON user.user_id=post.owner';
			const [rows,fields] = await connection.execute(query);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.getAllByUser = async(req, res) => {
		try {
			const query = 'SELECT * FROM post INNER JOIN media ON media.media_id=post.media INNER JOIN user ON user.user_id=post.owner WHERE post.owner=?;';
			const [rows,fields] = await connection.execute(query, [req.params.user_id]);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.getAllByCategory = async(req, res) => {
		try {
			const query = 'SELECT * FROM post INNER JOIN media ON media.media_id=post.media INNER JOIN user ON user.user_id=post.owner WHERE post.post_id IN ( ';
			const [postIds,p_fields] = await connection.execute('SELECT post_id FROM post_category WHERE category_id=?', [req.params.category_id]);
			const [rows,fields] = await connection.execute(query + postIds.map(p => p.post_id) + ' )');
			res.send(rows);
		} catch (error) {
			res.status(error).json(error);
		}
	};

	module.delete = async(req, res) => {
		if (req.user) {
			try {
				const [rows,fields] = await connection.query('DELETE FROM post WHERE post_id=?', [req.params.post_id]);
				res.send(rows);
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			res.send({message: 'Unautherized authentication required.'});
		}
	};

	return module;
};
