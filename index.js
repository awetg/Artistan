'use strict';
require('dotenv').config();

//api routes
const mediaRoutes = require('./api/routes/media');	//all trafic at /api/media will be routed to this
const usersRoutes = require('./api/routes/users');	//all trafic at /api/users will be routed to this

const express = require('express');

const app = express();
app.use(express.static('public'))
	.use('/uploads', express.static('uploads'))
	.use(express.json())
	.use(express.urlencoded({extended: false}))
	.use('/api/media', mediaRoutes)
	.use('/api/users', usersRoutes);

// use this for any other undefined routes
// app.use((req, res, cb) => {
// 	const error = new Error('Not found');
// 	error.status = 404;
// 	cb(error);
// });

// //user this when any kind of error occurs
// app.use((error, req, res, cb) => {
// 	res.status(error.status || 500)
// 		.json({
// 			error: {
// 				message: error.message
// 			}
// 		})
// })

//welcome route at GET:localhost:3000 (part of app not api)
app.get('/', (req, res) => {
	console.log('welcome');
	// res.send('wellcome...');
});

app.listen(process.env.APP_PORT, () => console.log('Server running on localhost:3000.'));