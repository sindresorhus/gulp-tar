import {createReadStream} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import zlib from 'node:zlib';
import {pipeline} from 'node:stream/promises';
import test from 'ava';
import {pEvent} from 'p-event';
import gulp from 'gulp';
import gulpZip from 'gulp-gzip';
import tarfs from 'tar-fs';
import {rimrafSync} from 'rimraf';
import gulpTar from '../index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('should include directories', async t => {
	const onTargz = async () => {
		const filename = 'archive.tar.gz';
		const fullPath = path.join(__dirname, 'dest', filename);
		const rs = createReadStream(fullPath);

		const expectedNames = [
			'dir-fixture/inside.txt',
			'fixture.txt',
		];

		await pipeline(
			rs,
			zlib.createGunzip(),
			tarfs.extract(path.join(__dirname, 'dest-out'), {
				mapStream(filestream, header) {
					const expected = expectedNames.pop();
					t.is(header.name, expected);
					return filestream;
				},
			}),
		);

		for (const directory of ['dest', 'dest-out']) {
			rimrafSync(path.join(__dirname, directory));
		}
	};

	await pEvent(
		gulp.src('fixture/**/*', {cwd: __dirname})
			.pipe(gulpTar('archive.tar'))
			.pipe(gulpZip())
			.pipe(gulp.dest('dest', {cwd: __dirname})),
		'finish',
	);

	await onTargz();
});
