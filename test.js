'use strict';
var path = require('path');
var Stream = require('stream');
var assert = require('assert');
var gutil = require('gulp-util');
var tar = require('./');
var tarStream = require('tar-stream');
var map = require('vinyl-map');
var Readable = Stream.Readable;

it('should tar files in buffer mode', function (cb) {
	var stream = tar('test.tar');

	stream.on('data', function (file) {
		assert.equal(file.path, path.join(__dirname, 'fixture', 'test.tar'));
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
		assert.equal(file.path, path.join(__dirname, 'fixture', 'test.tar'));
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

it('should include directories', function (cb) {
  	var stream = tar('test.tar');

	var evaluate = map(function (code, filename) {
		var inspect = tarStream.extract();

		inspect.on('entry', function (header, stream, callback) {
			stream.on('end', function () {
				assert.equal(header.type, 'directory');
				assert.equal(header.name, 'fixture2/');
				cb();
			});
			stream.resume();
		});

		var rs = Readable();
		rs._read = function () {
			rs.push(code.toString());
		};

		rs.pipe(inspect);
	});

	stream.pipe(evaluate);

	stream.write(new gutil.File({
	    cwd: __dirname,
    	base: path.join(__dirname, 'fixture'),
    	path: path.join(__dirname, 'fixture/fixture2'),
    	contents: null
  	}));

  	stream.end();
});
