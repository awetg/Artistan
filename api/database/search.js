module.exports = (connection) => {
	const module = {};

	module.search = async (req, res) => {
		if(req.query.keywordTitle){
			try {
				const query = `SELECT post.*, username, fullname, media.*, media.time_created as post_time, avatar.path as avata_path,
					(SELECT COUNT(1) FROM likes_post WHERE likes_post.post_id=post.post_id group by post_id) as likes 
					FROM post INNER JOIN media ON media.media_id=post.media INNER JOIN user ON user.user_id=post.owner 
					LEFT JOIN avatar ON user.user_id=avatar.user_id WHERE title LIKE ?`;
				const [r, f] = await connection.query(query, [req.query.keywordTitle]);
				console.log(r);
				res.send(r);
			} catch(error) {
				res.status(401).json(error);
			}
		}	

		if(req.query.keywordName){
			try {
				const [r, f] = await connection.query('SELECT * FROM post WHERE title=?', [req.query.keywordName]);
				console.log(r);
				res.send(r);
			} catch(error) {
				res.status(401).json(error);
			}
		}	
	}
	return module;
}