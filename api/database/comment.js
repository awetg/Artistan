/* This is controller module for comment data
* This module performs CRUDE operation to database on comment table only
*/
'use strict';

module.exports = (connection) => {

	const module = {};

	module.createComment = async(req, res) => {

		if (req.user) {

			try {
				const query = 'INSERT INTO comment (content, owner, parent_post) VALUES(?, ?, ?)';
				const queryParams = [req.body.content, req.user.user_id, req.params.post_id];
				const [rows, _] = await connection.execute(query, queryParams);
				res.send({message: 'Comment added.', comment: req.body.content, comment_id: rows.insertId});
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			res.status(401).json({message: 'Unauthorized. Only logged in user can comment.'});
		}
	};

	module.getAllCommentsForPost = async(req, res) => {

		try {
			const [rows, _] = await connection.execute('select comment.*, avatar.path as avatar_path, user.fullname from comment left join avatar on avatar.user_id=comment.owner left join user on user.user_id=comment.owner	where comment.parent_post=?',[req.params.post_id]);
			res.send(rows);
		} catch (error) {
			console.log(error);
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
