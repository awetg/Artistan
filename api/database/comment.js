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
		if(req.user) {
			try {
				let query, queryParams, rows, fields;
				if(req.user.admin_privileges) {
					query = 'UPDATE comment SET content=? WHERE comment_id=?';
					queryParams = [req.body.content, req.params.comment_id];
				} else {
					query = 'UPDATE comment SET content=? WHERE comment_id=? AND owner=?';
					queryParams = [req.body.content, req.params.comment_id, req.user.user_id];
				}
				[rows, fields] = await connection.execute();
				if(rows.affectedRows)
					res.send({message: 'Comment delted.'});
				else
					res.send({message: 'Comment does not exist or you don not have permission to delete'});
			} catch(error) {
				res.status(401).json(error);
			}
		} else {
			res.status(401).json('Unautherzied.');
		}
	}

	module.deleteComment = async(req, res) => {
		if(req.user) {
			try {
				let query, queryParams, rows, fields;
				if(req.user.admin_privileges) {
					query = 'DELETE FROM comment WHERE comment_id=?';
					queryParams = [req.params.comment_id];
				} else {
					query = 'DELETE FROM comment WHERE comment_id=? AND owner=?';
					queryParams = [req.params.comment_id, req.user.user_id];
				}
				[rows, fields] = await connection.execute();
				if(rows.affectedRows)
					res.send({message: 'Comment delted.'});
				else
					res.send({message: 'Comment does not exist or you don not have permission to delete'});
			} catch(error) {
				res.status(401).json(error);
			}
		} else {
			res.status(401).json('Unautherzied.');
		}
	}

	return module;
}