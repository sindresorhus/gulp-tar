import {createReadStream} from 'node:fs';
import path from 'node:path';
import {createGunzip} from 'node:zlib';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import {pEvent} from 'p-event';
import tarfs from 'tar-fs';
import {rimraf} from 'rimraf';
import vinylFs from 'vinyl-fs';
import gulp from 'gulp';
import gulpZip from 'gulp-gzip';
import gulpTar from '../index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('should include symlink', async t => {
	const onTargz = async () => {
		const filename = 'archive.tar.gz';
		const fullPath = path.join(__dirname, 'dest', filename);
		const rs = createReadStream(fullPath);

		const expectedHeaders = {
			'fixture/.symlink/symlink.txt': {type: 'symlink', linkname: '../fixture.txt'},
			'fixture/dir-fixture/inside.txt': {type: 'file'},
			'fixture/fixture.txt': {type: 'file'},
			'fixture/dir-fixture/': {type: 'directory'},
		};

		const extractStream = tarfs.extract(path.join(__dirname, 'dest-out'), {
			map(header) {
				const expected = expectedHeaders[header.name];
				if (expected) {
					t.is(header.type, expected.type);
					if (header.type === 'symlink') {
						t.is(header.linkname, expected.linkname);
					}
				}

				return header;
			},
		});

		const finalStream = rs.pipe(createGunzip()).pipe(extractStream);

		await pEvent(finalStream, 'finish');

		for (const directory of ['dest', 'dest-out']) {
			await rimraf(path.join(__dirname, directory)); // eslint-disable-line no-await-in-loop
		}
	};

	const archiveStream = vinylFs
		.src(['fixture/**/*', 'fixture/.symlink/**/*'], {
			cwd: __dirname,
			base: __dirname,
			resolveSymlinks: false,
		})
		.pipe(gulpTar('archive.tar'))
		.pipe(gulpZip())
		.pipe(gulp.dest('dest', {cwd: __dirname}));

	await pEvent(archiveStream, 'finish');
	await onTargz();
});
