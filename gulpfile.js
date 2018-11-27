const gulp = require('gulp');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const compiler = require('webpack');
const webpack = require('webpack-stream');
const named = require('vinyl-named');
const nodemon = require('gulp-nodemon');

// read .env
require('dotenv').config();

/**
 * Gulp Tasks
 */

gulp.task('browser-sync', ['nodemon'], () => {
	browserSync({
		// files: ['client/**/*.{html,js,scss}'],
		proxy: 'localhost:' + process.env.APP_PORT, // local node app address
		port: 7000, // use *different* port than above
		notify: false,
		open: false
	});
});

gulp.task('nodemon', ['scripts'], (cb) => {
	let called = false;
	return nodemon({
		script: 'index.js',
		ignore: [
			'gulpfile.js',
			'node_modules/'
		]
	})
		.on('start', () => {
			if (!called) {
				called = true;
				cb();
			}
		})
		.on('restart', () => {
			setTimeout(() => {
				reload({ stream: false });
			}, 1000);
		});
});

// Compile ES6 so that browsers can understand
gulp.task('scripts', () =>
	gulp.src(
		[
			'node_modules/babel-polyfill/dist/polyfill.js',
			'client/js/*.js'
		])
		.pipe(named())
		.pipe(webpack({
			mode: 'development',
			output: {
				filename: '[name].js'
			}
		}, compiler))
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(gulp.dest('client/dist/js'))
);

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () =>
	gulp.src('client/styles/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('client/dist/css'))
		.pipe(reload({stream: true}))
);

gulp.task('default', ['scripts', 'sass', 'browser-sync'], () => {
	gulp.watch('client/styles/*.scss', ['sass']);
	gulp.watch(['client/**/*.html'], reload);
	gulp.watch(['client/js/**/*.js'], ['scripts']);
});
