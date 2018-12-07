module.exports = (connection) => {
	const module = {};

	module.search = async (req, res) => {
		if(req.query.keywordTitle){
			try {
				const [r, f] = await connection.query('SELECT * FROM post INNER JOIN media ON media.media_id=post.media INNER JOIN user ON user.user_id=post.owner WHERE title=?', [req.query.keywordTitle]);
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