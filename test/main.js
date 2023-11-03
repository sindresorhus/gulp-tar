import {Buffer} from 'node:buffer';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {Readable as Stream} from 'node:stream';
import test from 'ava';
import {pEvent} from 'p-event';
import Vinyl from 'vinyl';
import tar from '../index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('should tar files in buffer mode', async t => {
	const stream = tar('test.tar');

	const onData = pEvent(stream, 'data');
	stream.write(new Vinyl({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: Buffer.from('hello world 1'),
	}));
	stream.write(new Vinyl({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: Buffer.from('hello world 2'),
	}));
	stream.end();

	const file = await onData;
	t.is(file.path, path.join(__dirname, 'fixture', 'test.tar'));
	t.is(file.relative, 'test.tar');
});

test('should tar files in stream mode', async t => {
	const stream = tar('test.tar');

	const stringStream1 = new Stream();
	const stringStream2 = new Stream();
	stringStream1._read = () => {};
	stringStream2._read = () => {};
	stringStream1.push('hello world 1');
	stringStream2.push('hello world 2');

	const onData = pEvent(stream, 'data');
	const onEnd = pEvent(stream, 'end');
	stream.write(new Vinyl({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: stringStream1,
	}));
	stream.write(new Vinyl({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: stringStream2,
	}));
	stream.end();

	const file = await onData;
	t.is(file.path, path.join(__dirname, 'fixture', 'test.tar'));
	t.is(file.relative, 'test.tar');
	await onEnd;
});

test('should output file.contents as a Stream', async t => {
	const stream = tar('test.tar');

	const onData = pEvent(stream, 'data');
	stream.write(new Vinyl({
		cwd: __dirname,
		base: path.join(__dirname, 'fixture'),
		path: path.join(__dirname, 'fixture/fixture.txt'),
		contents: Buffer.from('hello world'),
	}));
	stream.end();

	const file = await onData;
	t.true(file.contents.readable);
	stream.end();
});
