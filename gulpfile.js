var gulp = require('gulp');
var tar = require('./index');

gulp.task('default', function () {
	gulp.src('fixture/fixture.txt')
		.pipe(tar('test.tar'))
		.pipe(gulp.dest('dest'));
});
