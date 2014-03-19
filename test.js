'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var tar = require('./index');
var path = require('path');
var Stream = require('stream');

it('should tar files in buffer mode', function (cb) {
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
		contents: new Buffer('hello world 1')
	}));

	stream.write(new gutil.File({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: new Buffer('hello world 2')
	}));

	stream.end();
});

it('should tar files in stream mode', function (cb) {
	var stream = tar('test.tar');

	var string_stream1 = new Stream();
	string_stream1.pipe = function(dest) {
		dest.write('hello world 1');
	}

	var string_stream2 = new Stream();
	string_stream2.pipe = function(dest) {
		dest.write('hello world 2');
	}

	stream.on('data', function (file) {
		assert.equal(file.path, path.join(__dirname, 'test.tar'));
		assert.equal(file.relative, 'test.tar');
		cb();
	});

	stream.write(new gutil.File({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: string_stream1
	}));

	stream.write(new gutil.File({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: string_stream2
	}));

	stream.end();
});

it('should output file.contents as a Stream', function (cb) {
	var stream = tar('test.tar');

	stream.on('data', function (file) {
		assert(file.contents instanceof Stream, "File contents should be a Stream object");
		cb();
	});

	stream.write(new gutil.File({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: new Buffer('hello world')
	}));

	stream.end();
});

