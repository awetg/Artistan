module.exports = (connection) => {
	const module = {};
	module.createPost = async (req, res) => {
		//check if media was uploaded to db successfully
		if(!req.insertedFile.error) {
			const query = 'INSERT INTO post (title, media, owner) VALUES(?, ?, ?)';
			const queryParams = [req.body.title, req.insertedFile.rows.insertId, req.userData.user_id];
			const [rows, fields] = await connection.execute(query, queryParams).catch(error => res.status(401).json(error));
			res.send(rows);
		} else {
			res.status(401).json(req.insertedFile.error);
		}
	};

	module.comment = async (req, res) => {
		if(req.userLoggedIn) {
			const query = 'INSERT INTO comment (content, owner, parent_post) VALUES(?, ?, ?)';
			const queryParams = [req.body.content, req.userData.user_id, req.params.post_id];
			const [rows, fields] = await connection.execute(query, queryParams).catch(error => res.status(401).json(error));
			res.send(rows);
		} else {
			res.status(401).json(error);
		}
	};

	module.like = async (req, res) => {
		if(req.userLoggedIn) {
			const query = 'INSERT INTO likes_post (user_id, post_id) VALUES(?, ?)';
			const [rows,fields] = await connection.execute(query,[req.userData.user_id, req.params.post_id]).catch(error => res.status(401).json(error));
			res.send({message:'Posted liked'});
		}
	};


	// module.getAllPosts = async (req, res) => {
	// 	const [rows,fields] = await connection.execute('SELECT * FROM post').catch(error => res.status(401).json(error));
	// 	const mediaArr = rows.map(row => connection.query('SELECT * FROM media WHERE media_id=?', row.media).then(([results, fields]) => row.media = results[0]));
	// 	const userArr = rows.map(row => connection.query('SELECT * FROM user WHERE user_id=?', row.owner).then(([results, fields]) => row.owner = results[0]));

	// 	await Promise.all(mediaArr.concat(userArr))
	// 		.then(() => res.send(rows))
	// 		.catch(error => res.status(401).json(error));
	// };

	/* version two of getting all posts */
	module.getAllPosts = async (req, res) => {
		const [rows,fields] = await connection.execute('SELECT * FROM post').catch(error => res.status(401).json(error));
		const medias = connection.query('SELECT * FROM media WHERE media_id IN ( ' + rows.map(row => row.media).join(',') + ' )').then(([results, fields]) => rows.forEach((r,i) => r.media = results[i]))
		const users = connection.query('SELECT * FROM user WHERE user_id IN ( ' + rows.map(row => row.media).join(',') + ' )').then(([results, fields]) => rows.forEach((r,i) => r.owner = results[i]))

		await Promise.all([medias,users])
			.then(() => res.send(rows))
			.catch(error => res.status(401).json(error));
	}

	return module;
}