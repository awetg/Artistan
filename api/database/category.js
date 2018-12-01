module.exports = (connection) => {
	const module = {};
	module.getAllCategory = async (req, res) => {
		try {
			const [rows, fields] = await connection.execute('SELECT * FROM category');
			res.send(rows);
		} catch(error) {
			res.status(401).json(error);
		}
	}

	module.addCategory = async (req, res) => {
		try {
			const [rows, fields] = await connection.query('INSERT INTO category(name) VALUES(?)', [req.body.category_name]);
			res.send({message:'Category inserted'});
		} catch(error) {
			res.status(401).json(error);
		}
	}

	module.updateCategory = async (req, res) => {
		try {
			const [rows, fields] = await connection.execute('UPDATE category SET name=? WHERE category_id=?', [req.body.category_name, req.params.category_id]);
			res.send({message: 'Category updated'});
		} catch(error) {
			res.status(401).json(error);
		}
	}

	module.deleteCategory = async (req, res) => {
		try {
			const [rows, fields] = await connection.query('DELETE FROM category WHERE category_id=?', [req.params.category_id]);
			res.send({message: 'Category deleted'});
		} catch(error) {
			res.status(401).json(error);
		}
	}

	return module;
}