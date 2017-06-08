'use strict';
/* eslint-env mocha */
const path = require('path');
const Stream = require('stream');
const assert = require('assert');
const gutil = require('gulp-util');
const tarStream = require('tar-stream');
const vinylMap = require('vinyl-map');
const tar = require('.');

const Readable = Stream.Readable;

it('should tar files in buffer mode', cb => {
	const stream = tar('test.tar');

	stream.on('data', file => {
		assert.equal(file.path, path.join(__dirname, 'fixture', 'test.tar'));
		assert.equal(file.relative, 'test.tar');
		cb();
	});

	stream.write(new gutil.File({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: Buffer.from('hello world 1')
	}));

	stream.write(new gutil.File({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: Buffer.from('hello world 2')
	}));

	stream.end();
});

it('should tar files in stream mode', cb => {
	const stream = tar('test.tar');

	const stringStream1 = new Stream();
	const stringStream2 = new Stream();

	stringStream1.pipe = function (dest) {
		dest.write('hello world 1');
	};

	stringStream2.pipe = function (dest) {
		dest.write('hello world 2');
	};

	stream.on('data', file => {
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

it('should output file.contents as a Stream', cb => {
	const stream = tar('test.tar');

	stream.on('data', file => {
		assert(file.contents instanceof Stream, 'File contents should be a Stream object');
		cb();
	});

	stream.write(new gutil.File({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: Buffer.from('hello world')
	}));

	stream.end();
});

it('should include directories', cb => {
	const stream = tar('test.tar');

	const evaluate = vinylMap(code => {
		const inspect = tarStream.extract();
		const rs = new Readable();

		inspect.on('entry', (header, stream) => {
			stream.on('end', () => {
				assert.equal(header.type, 'directory');
				assert.equal(header.name, 'fixture2/');
				cb();
			});

			stream.resume();
		});

		rs._read = function () {
			rs.push(code.toString());
		};

		rs.pipe(inspect);
	});

	stream.write(new gutil.File({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture2'),
		contents: null
	}));

	stream.end();
	stream.pipe(evaluate);
});
