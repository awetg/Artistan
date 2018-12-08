/* This is controller module for comment data
* This module performs CRUDE operation to database on comment table only
*/
module.exports = (connection) => {
	const module = {};
	module.createComment = async(req, res) => {
		if (req.user) {
			try {
				const query = 'INSERT INTO comment (content, owner, parent_post) VALUES(?, ?, ?)';
				const queryParams = [req.body.content, req.user.user_id, req.params.post_id];
				const [rows, _] = await connection.execute(query, queryParams);
				res.send({message: 'Comment created.', comment: req.body.content, comment_id: rows.insertId});
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			res.status(401).json({message: 'Unautherziez. Only loggedin user can comment.'});
		}
	};

	module.getAllCommentsForPost = async(req, res) => {
		try {
			const query = `SELECT post.*, username, fullname, media.path, media.mimetype, media.time_created AS post_time, avatar.path AS avatar_path,
				(SELECT COUNT(1) FROM likes_post WHERE likes_post.post_id=post.post_id) AS likes,
				(SELECT COUNT(1) FROM comment WHERE parent_post=post.post_id) AS comments,
				(SELECT GROUP_CONCAT(name) FROM post_category JOIN category ON post_category.category_id=category.category_id WHERE post_category.post_id=post.post_id) AS post_category
				FROM post LEFT JOIN avatar ON post.owner=avatar.user_id INNER JOIN media ON media.media_id=post.media 
				INNER JOIN user ON user.user_id=post.owner WHERE post.post_id=? ;`;
			const postDetails = connection.execute(query, [req.params.post_id]).then(([rows,_]) => rows);
			const postComments = connection.execute('SELECT * FROM comment WHERE parent_post=?',[req.params.post_id]).then(([rows, _]) => rows);
			const addView = connection.execute('UPDATE post SET views=views+1 WHERE post_id=?',[req.params.post_id]);
			Promise.all([postDetails, postComments, addView])
				.then(results => res.send(results));
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.updateComment = async(req, res) => {
		if (req.user) {
			try {
				const query = req.user.admin_privileges ? 'UPDATE comment SET content=? WHERE comment_id=?' : 'UPDATE comment SET content=? WHERE comment_id=? AND owner=?';
				const queryParams = req.user.admin_privileges ? [req.body.content, req.params.comment_id] : [req.body.content, req.params.comment_id, req.user.user_id];
				const [rows, _] = await connection.execute(query, queryParams);
				if (rows.affectedRows) {
					res.send({message: 'Comment updated.', comment: req.body.content, comment_id: req.params.comment_id});
				} else {
					res.send({message: 'Comment does not exist or you don not have permission to delete'});
				}
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			res.status(401).json('Unautherzied.');
		}
	};

	module.deleteComment = async(req, res) => {
		if (req.user) {
			try {
				const query = req.user.admin_privileges ? 'DELETE FROM comment WHERE comment_id=?' : 'DELETE FROM comment WHERE comment_id=? AND owner=?';
				const queryParams = req.user.admin_privileges ? [req.params.comment_id] : [req.params.comment_id, req.user.user_id];
				const [rows, _] = await connection.execute(query, queryParams);
				rows.affectedRows ? res.send({message: 'Comment delted.'}) : res.send({message: 'Comment does not exist or you don not have permission to delete'});
			} catch (error) {
				res.send(error);
			}
		} else {
			res.status(401).json('Unautherzied.');
		}
	};

	return module;
};
