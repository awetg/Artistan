module.exports = (connection) => {
	const module = {};
	module.getAllInterests = async (req, res) => {
		try {
			const [rows, fields] = await connection.execute('SELECT * FROM user_intersts WHERE user_id=?',[req.user.user_id]);
			res.send(rows);
		} catch(error) {
			res.status(401).json(error);
		}
	}

	module.addInterest = async (req, res) => {
		try {
			const [r, f] = await connection.query('SELECT * FROM user_intersts WHERE user_id=? AND category_id=?', [req.user.user_id, req.params.category_id]);
			console.log(r);
			if(r.length == 0) {
				const [rows, fields] = await connection.query('INSERT INTO user_intersts VALUES(?,?)', [req.user.user_id, req.params.category_id]);
				res.send({message:'Interest inserted'});
			} else {
				res.send({message: 'Interest already exist'});
			}
		} catch(error) {
			res.status(401).json(error);
		}
	}

	module.deleteInterest = async (req, res) => {
		try {
			const [rows, fields] = await connection.query('DELETE FROM user_intersts WHERE user_id=? AND category_id=?', [req.user.user_id, req.params.category_id]);
			res.send({message: 'Interest deleted'});
		} catch(error) {
			res.status(401).json(error);
		}
	}

	return module;
}