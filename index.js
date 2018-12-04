
require('dotenv').config();
const express = require('express');

//api routes and local modules
const mediaRoutes = require('./api/routes/media');	//all trafic at base_url/api/media will be routed to this
const usersRoutes = require('./api/routes/users');	//all trafic at base_url/api/users will be routed to this
const postRoutes = require('./api/routes/post');	//all trafic at base_url/api/post will be routed to this
const commentRoutes = require('./api/routes/comment');	//all trafic at base_url/api/post will be routed to this
const categoryRoutes = require('./api/routes/category');	//all trafic at base_url/api/post will be routed to this
const authRoutes = require('./api/routes/auth');	//all trafic at base_url/api/post will be routed to this

const follower = require('./api/routes/follower');	//all trafic at base_url/api/post will be routed to this
//const user_interested = require('./api/routes/user_interested');	//all trafic at base_url/api/post will be routed to this
//const search = require('./api/routes/search');	//all trafic at base_url/api/post will be routed to this

const passport = require('./modules/passport-config');

const clientRoot = { root: 'client' };

const app = express();
app.use(express.static('client'))
	.use('/uploads', express.static('uploads'))
	.use(express.json())
	.use(express.urlencoded({extended: false}))
	.use('/api/media', mediaRoutes)
	.use('/api/users', usersRoutes)
	.use('/api/post', postRoutes)
	.use('/api/comment', commentRoutes)
	.use('/api/category', categoryRoutes)
	.use('/api/auth', authRoutes)
	.use('/api/follower', follower)
	//.use('/api/user_interested', user_interested)
	//.use('/api/search', search)
	;

// client routing
app.get('/', (_, res) => {
	res.sendFile('index.html', clientRoot);
});

app.get('/login', (_, res) => {
	res.sendFile('login.html', clientRoot);
});

app.get('/register', (_, res) => {
	res.sendFile('register.html', clientRoot);
});

app.get('/upload', (_, res) => {
	res.sendFile('upload.html', clientRoot);
});

app.get('/post/:id', (_, res) => {
	res.sendFile('view-post.html', clientRoot);
});

//use this for any other undefined routes
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

//use this when any kind of error occurs
app.use((error, req, res, next) => {
	res.status(error.status || 500).json({error: {message: error.message}});
});

app.listen(process.env.APP_PORT, () => console.log('Server running on localhost:3000.'));
