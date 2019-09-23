/* eslint-env mocha */
const {throws} = require('assert');
const gulp = require('gulp');
const gulpZip = require('gulp-gzip');
const gulpTar = require('..');

it('should not fail on empty directory', done => {
	gulp
		.src('fixture/.empty/**/*', {cwd: __dirname})
		.pipe(gulpTar('archive.tar'))
		.pipe(gulpZip())
		.pipe(gulp.dest('dest', {cwd: __dirname}))
		.on('finish', () => {
			done();
		});
});

it('should fail on missing filename', () => {
	throws(() => {
		gulpTar();
	}, /`filename` required/);
});
