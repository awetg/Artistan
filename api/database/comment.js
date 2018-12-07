module.exports = (connection) => {
	const module = {};
	module.createComment = async(req, res) => {
		if(req.user) {
			try {			
				const query = 'INSERT INTO comment (content, owner, parent_post) VALUES(?, ?, ?)';
				const queryParams = [req.body.content, req.user.user_id, req.params.post_id];
				const [rows, fields] = await connection.execute(query, queryParams);
				res.send({message: 'Comnet created.'});
			} catch(error) {
				res.status(401).json(error);
			}
		} else {
			res.status(401).json({message: 'Unautherziez. Only loggedin user can comment.'});
		}
	}

	module.getAllComments = async(req, res) => {
		try {
			const [rows, fields] = await connection.execute('SELECT * FROM comment WHERE parent_post=?',[req.params.post_id]);
		res.send(rows);
		} catch(error) {
			res.status(401).json(error);
		}
	}

	module.updateComment = async(req, res) => {
		try {
			const [rows, fields] = await connection.execute('UPDATE comment SET content=? WHERE comment_id=?',[req.body.content, req.params.comment_id]);
		res.send({message: 'Comment updated.'});
		} catch(error) {
			res.status(401).json(error);
		}
	}

	module.deleteComment = async(req, res) => {
		try {
			const [rows, fields] = await connection.execute('DELETE FROM comment WHERE comment_id=?',[req.params.comment_id]);
		res.send(rows);
		} catch(error) {
			res.status(401).json(error);
		}
	}

	return module;
}