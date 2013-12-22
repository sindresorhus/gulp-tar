'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var tar = require('./index');

it('should tar files', function (cb) {
	var stream = tar('test.tar');

	stream.on('data', function (file) {
		assert.equal(file.path, '~/dev/gulp-tar/test.tar');
		assert.equal(file.relative, 'test.tar');
		cb();
	});

	stream.write(new gutil.File({
		cwd: '~/dev/gulp-tar',
		base: '~/dev/gulp-tar/fixture',
		path: '~/dev/gulp-tar/fixture/fixture.txt',
		contents: new Buffer('hello world')
	}));

	stream.write(new gutil.File({
		cwd: '~/dev/gulp-tar',
		base: '~/dev/gulp-tar/fixture',
		path: '~/dev/gulp-tar/fixture/fixture2.txt',
		contents: new Buffer('hello world 2')
	}));

	stream.end();
});
