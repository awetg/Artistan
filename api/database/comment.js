module.exports = (connection) => {
	const module = {};
	module.createComment = async(req, res) => {
		if(req.userLoggedIn) {
			const query = 'INSERT INTO comment (content, owner, parent_post) VALUES(?, ?, ?)';
			const queryParams = [req.body.content, req.userData.user_id, req.params.post_id];
			const [rows, fields] = await connection.execute(query, queryParams).catch(error => res.status(401).json(error));
			res.send(rows);
		} else {
			res.status(401).json(error);
		}
	}

	module.getAllComments = async(req, res) => {
		const [rows, fields] = await connection.execute('SELECT * FROM comment WHERE parent_post=?',[req.params.post_id]).catch(error => res.status(401).json(error));
		res.send(rows);
	}

	module.updateComment = async(req, res) => {
		const [rows, fields] = await connection.execute('UPDATE comment SET content=? WHERE comment_id=?',[req.body.content, req.params.comment_id]).catch(error => res.status(401).json(error));
		res.send(rows);
	}

	module.deleteComment = async(req, res) => {
		const [rows, fields] = await connection.execute('DELETE FROM comment WHERE comment_id=?',[req.params.comment_id]).catch(error => res.status(401).json(error))
		res.send(rows);
	}

	return module;
}