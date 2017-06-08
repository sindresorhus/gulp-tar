'use strict';
const gulp = require('gulp');
const gzip = require('gulp-gzip');
const tar = require('.');

gulp.task('default', () => {
	// Tar in buffer mode
	gulp.src('fixture/fixture.txt')
		.pipe(tar('test1.tar'))
		.pipe(gulp.dest('dest'));

	// Tar in stream mode
	gulp.src('fixture/fixture.txt', {buffer: false})
		.pipe(tar('test2.tar'))
		.pipe(gulp.dest('dest'));

	// Tar and gzip in buffer mode
	gulp.src('fixture/fixture.txt')
		.pipe(tar('test3.tar'))
		.pipe(gzip())
		.pipe(gulp.dest('dest'));

	// Tar and gzip in stream mode
	gulp.src('fixture/fixture.txt', {buffer: false})
		.pipe(tar('test4.tar'))
		.pipe(gzip())
		.pipe(gulp.dest('dest'));

	// Check default parameters for tar-stream
	gulp.src('fixture/fixture.txt')
		.pipe(tar('test_options.tar', {mtime: 0}))
		.pipe(gulp.dest('dest'));
});
