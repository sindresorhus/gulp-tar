import {Buffer} from 'node:buffer';
import process from 'node:process';
import test from 'ava';
import {pEvent} from 'p-event';
import Vinyl from 'vinyl';
import gulpTar from '../index.js';

test('should handle Windows directory permissions correctly', async t => {
	const originalPlatform = process.platform;

	// Mock Windows platform
	Object.defineProperty(process, 'platform', {
		value: 'win32',
		configurable: true,
	});

	try {
		const stream = gulpTar('test.tar');
		const onData = pEvent(stream, 'data');

		// Create a directory with problematic Windows permissions (no execute bit)
		const directoryVinyl = new Vinyl({
			cwd: '/test',
			base: '/test',
			path: '/test/my-dir',
			contents: null, // Directory
			stat: {
				mode: 0o644, // Problematic: directory without execute bit
				mtime: new Date(),
			},
		});

		// Create a file in that directory
		const fileVinyl = new Vinyl({
			cwd: '/test',
			base: '/test',
			path: '/test/my-dir/file.txt',
			contents: Buffer.from('test content'),
			stat: {
				mode: 0o644,
				mtime: new Date(),
			},
		});

		stream.write(directoryVinyl);
		stream.write(fileVinyl);
		stream.end();

		const file = await onData;

		// Verify the tar was created successfully
		t.is(file.relative, 'test.tar');
		t.true(file.contents.readable);
	} finally {
		// Restore original platform
		Object.defineProperty(process, 'platform', {
			value: originalPlatform,
			configurable: true,
		});
	}
});

test('should preserve mode on non-Windows platforms', async t => {
	const originalPlatform = process.platform;

	// Mock Linux platform
	Object.defineProperty(process, 'platform', {
		value: 'linux',
		configurable: true,
	});

	try {
		const stream = gulpTar('test.tar');
		const onData = pEvent(stream, 'data');

		// Create a directory without execute bit on Linux (should be preserved)
		const directoryVinyl = new Vinyl({
			cwd: '/test',
			base: '/test',
			path: '/test/my-dir',
			contents: null,
			stat: {
				mode: 0o644, // This should be preserved on non-Windows
				mtime: new Date(),
			},
		});

		stream.write(directoryVinyl);
		stream.end();

		const file = await onData;

		// Verify the tar was created successfully
		t.is(file.relative, 'test.tar');
		t.true(file.contents.readable);
	} finally {
		// Restore original platform
		Object.defineProperty(process, 'platform', {
			value: originalPlatform,
			configurable: true,
		});
	}
});
