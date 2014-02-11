'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var tar = require('./index');
var path = require('path');

it('should tar files', function (cb) {
	var stream = tar('test.tar');

	stream.on('data', function (file) {
		assert.equal(file.path, path.join(__dirname, 'test.tar'));
		assert.equal(file.relative, 'test.tar');
		cb();
	});

	stream.write(new gutil.File({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: new Buffer('hello world')
	}));

	stream.write(new gutil.File({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: new Buffer('hello world 2')
	}));

	stream.end();
});