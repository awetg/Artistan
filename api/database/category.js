/* This is controller module for category data
* This module performs CRUDE operation to database on category table only
*/
'use strict';

module.exports = (connection) => {

	const module = {};

	module.getAllCategory = async(req, res) => {

		try {
			const [rows, _] = await connection.execute('SELECT * FROM category');
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.addCategory = async(req, res) => {
		try {
			await connection.query('INSERT INTO category(name) VALUES(?)', [req.body.category_name]);
			res.send({message: 'Category inserted'});
		} catch (error) {
			(error.errno === 1062) ? res.send({error: {message: 'Category alread exist.'}}) : res.status(401).json(error);
		}
	};

	module.updateCategory = async(req, res) => {
		try {
			const [rows, _] = await connection.execute('UPDATE category SET name=? WHERE category_id=?', [req.body.category_name, req.params.category_id]);
			rows.affectedRows ? res.send({message: 'Category updated.'}) : res.send({message: 'Category does not exist.'});
		} catch (error) {
			(error.errno === 1062) ? res.send({error: {message: 'Category alread exist.'}}) : res.status(401).json(error);
		}
	};

	module.deleteCategory = async(req, res) => {
		try {
			const [rows, _] = await connection.query('DELETE FROM category WHERE category_id=?', [req.params.category_id]);
			rows.affectedRows ? res.send({message: 'Category delted.'}) : res.send({message: 'Category does not exist.'});
		} catch (error) {
			res.status(401).json(error);
		}
	};

	return module;
};
