module.exports = (connection) => {
	const module = {};

	module.searchAPost = async (req, res) => {
		try {
			const [r, f] = await connection.query('SELECT * FROM post WHERE title=?', [req.body.title]);
		} catch(error) {
			res.status(401).json(error);
		}
	}

	return module;
}