'use strict';
/* eslint-env mocha */
const path = require('path');
const Stream = require('stream');
const assert = require('assert');
const Vinyl = require('vinyl');
const tar = require('.');

it('should tar files in buffer mode', callback => {
	const stream = tar('test.tar');

	stream.on('data', file => {
		assert.strictEqual(file.path, path.join(__dirname, 'fixture', 'test.tar'));
		assert.strictEqual(file.relative, 'test.tar');
		callback();
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

it('should tar files in stream mode', callback => {
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
		assert.strictEqual(file.path, path.join(__dirname, 'fixture', 'test.tar'));
		assert.strictEqual(file.relative, 'test.tar');
	});

	stream.on('end', callback);

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

it('should output file.contents as a Stream', callback => {
	const stream = tar('test.tar');

	stream.on('data', file => {
		assert(file.contents instanceof Stream, 'File contents should be a Stream object');
		callback();
	});

	stream.write(new Vinyl({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: Buffer.from('hello world')
	}));

	stream.end();
});

