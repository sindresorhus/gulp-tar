'use strict';
var path = require('path');
var Stream = require('stream');
var assert = require('assert');
var gutil = require('gulp-util');
var tar = require('./index');

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

	var stringStream1 = new Stream();
	stringStream1.pipe = function(dest) {
		dest.write('hello world 1');
	}

	var stringStream2 = new Stream();
	stringStream2.pipe = function(dest) {
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
		contents: stringStream1
	}));

	stream.write(new gutil.File({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: stringStream2
	}));

	stream.end();
});

it('should output file.contents as a Stream', function (cb) {
	var stream = tar('test.tar');

	stream.on('data', function (file) {
		assert(file.contents instanceof Stream, 'File contents should be a Stream object');
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

