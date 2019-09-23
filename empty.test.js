/* eslint-env mocha */
const {throws} = require('assert');
const gulp = require('gulp');
const gulpZip = require('gulp-gzip');
const gulpTar = require('.');

it('should not fail on empty dir', done => {
	gulp
		.src('.empty/**/*')
		.pipe(gulpTar('archive.tar'))
		.pipe(gulpZip())
		.pipe(gulp.dest('dest'))
		.on('finish', () => done());
});

it('should fail on missing filename', done => {
	throws(() => gulpTar(), /`filename` required/);
	done();
});
