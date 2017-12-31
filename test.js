'use strict';
/* eslint-env mocha */
const path = require('path');
const Stream = require('stream');
const assert = require('assert');
const tarStream = require('tar-stream');
const vinylMap = require('vinyl-map');
const Vinyl = require('vinyl');
const tar = require('.');

it('should tar files in buffer mode', cb => {
	const stream = tar('test.tar');

	stream.on('data', file => {
		assert.equal(file.path, path.join(__dirname, 'fixture', 'test.tar'));
		assert.equal(file.relative, 'test.tar');
		cb();
	});

	stream.write(new Vinyl({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: Buffer.from('hello world 1')
	}));

	stream.write(new Vinyl({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: Buffer.from('hello world 2')
	}));

	stream.end();
});

it('should tar files in stream mode', cb => {
	const stream = tar('test.tar');

	const stringStream1 = new Stream.Readable();
	const stringStream2 = new Stream.Readable();

	stringStream1.pipe = dest => {
		dest.write('hello world 1');
	};

	stringStream2.pipe = dest => {
		dest.write('hello world 2');
	};

	stream.on('data', file => {
		assert.equal(file.path, path.join(__dirname, 'fixture', 'test.tar'));
		assert.equal(file.relative, 'test.tar');
	});

	stream.on('end', cb);

	stream.write(new Vinyl({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: stringStream1
	}));

	stream.write(new Vinyl({
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

	stream.write(new Vinyl({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: Buffer.from('hello world')
	}));

	stream.end();
});

it.skip('should include directories', cb => {
	const stream = tar('test.tar');

	const evaluate = vinylMap(code => {
		const inspect = tarStream.extract();
		const rs = new Stream.Readable();

		inspect.on('entry', (header, stream) => {
			stream.on('end', () => {
				assert.equal(header.type, 'directory');
				assert.equal(header.name, 'fixture2/');
				cb();
			});

			stream.resume();
		});

		rs._read = () => {
			rs.push(code.toString());
		};

		rs.pipe(inspect);
	});

	stream.pipe(evaluate);

	stream.end(new Vinyl({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture2'),
		contents: null
	}));
});
