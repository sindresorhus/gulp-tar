var gulp = require('gulp');
var tar = require('./index');
var gzip = require('gulp-gzip');

gulp.task('default', function () {

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
});
