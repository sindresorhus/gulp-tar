import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import {pEvent} from 'p-event';
import gulp from 'gulp';
import gulpZip from 'gulp-gzip';
import gulpTar from '../index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('should not fail on empty directory', async t => {
	const stream = gulp
		.src('fixture/.empty/**/*', {cwd: __dirname})
		.pipe(gulpTar('archive.tar'))
		.pipe(gulpZip())
		.pipe(gulp.dest('dest', {cwd: __dirname}));

	await t.notThrowsAsync(pEvent(stream, 'finish'));
});

test('should fail on missing filename', t => {
	t.throws(() => {
		gulpTar();
	}, {
		message: /`filename` required/,
	});
});
