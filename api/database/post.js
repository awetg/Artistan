module.exports = (connection) => {
	const module = {};
	module.createPost = async(req, res) => {
		//check if media was uploaded to db successfully
		if (!req.insertedFile.error) {
			const query = 'INSERT INTO post (title, media, owner) VALUES(?, ?, ?)';
			const queryParams = [req.body.title, req.insertedFile.rows.insertId, req.userData.user_id];
			const [rows, fields] = await connection.execute(query, queryParams).catch(error => res.status(401).json(error));
			await connection.execute('INSERT INTO post_category (post_id, category_id) VALUES(?, ?)', [rows.insertId, req.body.category])
				.catch(error => console.log(error));
			res.send(rows);
		} else {
			res.status(401).json(req.insertedFile.error);
		}
	}


	module.like = async(req, res) => {
		if (req.userLoggedIn) {
			const query = 'INSERT INTO likes_post (user_id, post_id) VALUES(?, ?)';
			const [rows,fields] = await connection.execute(query,[req.userData.user_id, req.params.post_id]).catch(error => res.status(401).json(error));
			res.send({message: 'Posted liked'});
		}
	}


	module.getAllPosts = async (req, res) => {
		//get all posts
		const [rows,fields] = await connection.execute('SELECT * FROM post').catch(error => res.status(401).json(error));
		//get media for each post
		const queryMedia = 	`SELECT * FROM media WHERE media_id IN ( ${rows.map(row => row.media).join(',')} )`;
		const medias = connection.query(queryMedia).then(([results, fields]) => rows.forEach((r,i) => r.media = results[i]))
		// const users = connection.query('SELECT * FROM user WHERE user_id IN ( ' + rows.map(row => row.owner).join(',') + ' )').then(([results, fields]) => rows.forEach((r,i) => r.owner = results[i]))
		//get owner of each post
		const users = rows.map(row => connection.query('SELECT * FROM user WHERE user_id=?', row.owner).then(([results, fields]) => row.owner = results[0]));
		//count likes for each post
		const likes = rows.map(row => connection.query('SELECT COUNT(1) FROM likes_post WHERE post_id=?', row.post_id).then(([results, fields]) => row.likes = results[0]['COUNT(1)']));
		//count comments for each post
		const comments = rows.map(row => connection.query('SELECT COUNT(1) FROM comment WHERE parent_post=?', row.post_id).then(([results, fields]) => row.comments = results[0]['COUNT(1)']));
		//run all arrays of promises at once asynchrounously
		await Promise.all(users.concat(likes, comments, medias))
			.then(() => res.send(rows))
			.catch(error => res.status(401).json(error));
	};

	module.getAllByUser = async(req, res) => {
		const [p_rows,p_fields] = await connection.execute('SELECT * FROM post WHERE owner=?', [req.params.user_id]).catch(error => res.status(401).json(error));

		const [u_rows, u_fields] = await connection.execute('SELECT * FROM user WHERE user_id=?', [req.params.user_id]).catch(error => res.status(401).json(error));
		/* assign all posts owner to this user */
		p_rows.forEach(row => row.owner = u_rows);

		const medias = connection.query('SELECT * FROM media WHERE media_id IN ( ' + p_rows.map(row => row.media).join(',') + ' )').then(([results, fields]) => p_rows.forEach((r,i) => r.media = results[i]))
		const likes = p_rows.map(row => connection.query('SELECT COUNT(1) FROM likes_post WHERE post_id=?', row.post_id).then(([results, fields]) => row.likes = results[0]['COUNT(1)']));
		const comments = p_rows.map(row => connection.query('SELECT COUNT(1) FROM comment WHERE parent_post=?', row.post_id).then(([results, fields]) => row.comments = results[0]['COUNT(1)']));
		await Promise.all(likes.concat(comments, medias))
			.then(() => res.send(p_rows))
			.catch(error => res.status(401).json(error));
	}

	module.getAllByCategory = async(req, res) =>{
		const [postIds,p_fields] = await connection.execute('SELECT post_id FROM post_category WHERE category_id=?', [req.params.category_id]).catch(error => res.status(401).json(error));

		const [rows,fields] = await connection.execute('SELECT * FROM post WHERE post_id IN ( ' + postIds.map(p => p.post_id) + ' )').catch(error => res.status(401).json(error));

		const medias = connection.query('SELECT * FROM media WHERE media_id IN ( ' + rows.map(row => row.media).join(',') + ' )').then(([results, fields]) => rows.forEach((r,i) => r.media = results[i]))
		const users = connection.query('SELECT * FROM user WHERE user_id IN ( ' + rows.map(row => row.owner).join(',') + ' )').then(([results, fields]) => rows.forEach((r,i) => r.owner = results[i]))
		const likes = rows.map(row => connection.query('SELECT COUNT(1) FROM likes_post WHERE post_id=?', row.post_id).then(([results, fields]) => row.likes = results[0]['COUNT(1)']));
		const comments = rows.map(row => connection.query('SELECT COUNT(1) FROM comment WHERE parent_post=?', row.post_id).then(([results, fields]) => row.comments = results[0]['COUNT(1)']));
		await Promise.all([medias,users].concat(likes, comments))
			.then(() => res.send(rows))
			.catch(error => res.status(401).json(error));	
	}

	module.delete = async(req, res) => {
		const [rows,fields] = await connection.query('DELETE FROM post WHERE post_id=?', [req.params.post_id]).catch(error => res.status(401).json(error));
		res.send(rows);
	}

	return module;
};
