module.exports = (connection) => {
	const module = {};
	module.getAllInterests = async(req, res) => {
		try {
			const [rows, _] = await connection.execute('SELECT * FROM user_intersts WHERE user_id=?',[req.user.user_id]);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.addInterest = async(req, res) => {
		try {
			const query = 'insert into user_intersts(user_id, category_id) VALUES ?';
			const queryParams = req.params[0].split('/').map(category_id => [req.user.user_id, category_id]);
			const [r, _] = await connection.query(query, [queryParams]);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.deleteInterest = async(req, res) => {
		try {
			const [rows, _] = await connection.query('DELETE FROM user_intersts WHERE user_id=? AND category_id=?', [req.user.user_id, req.params.category_id]);
			res.send({message: 'Interest deleted'});
		} catch (error) {
			res.status(401).json(error);
		}
	};

	return module;
};
