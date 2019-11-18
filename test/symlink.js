/* eslint-env mocha */
const {createReadStream} = require('fs');
const path = require('path');
const zlib = require('zlib');
const assert = require('assert');
const gulp = require('gulp');
const gulpZip = require('gulp-gzip');
const tarfs = require('tar-fs');
const rimraf = require('rimraf');
const vinylFs = require('vinyl-fs');
const gulpTar = require('..');

it('should include symlink', done => {
	const onTargz = () => {
		const filename = 'archive.tar.gz';
		const fullPath = path.join(__dirname, 'dest', filename);
		const rs = createReadStream(fullPath);

		rs.pipe(zlib.createGunzip())
			.pipe(
				tarfs.extract(path.join(__dirname, 'dest-out'), {
					map: header => {
						const expected = expectedNames.pop();
						assert.strictEqual(header.name, expected.name);
						assert.strictEqual(header.type, expected.type);
						if (header.type === 'symlink') {
							assert.strictEqual(header.linkname, expected.linkname);
						}

						return header;
					}
				})
			)
			.on('finish', () => {
				for (const directory of ['dest', 'dest-out']) {
					rimraf.sync(path.join(__dirname, directory));
				}

				done();
			});
	};

	const expectedNames = [
		{name: 'fixture/.symlink/symlink.txt', type: 'symlink', linkname: '../fixture.txt'},
		{name: 'fixture/dir-fixture/inside.txt', type: 'file'},
		{name: 'fixture/fixture.txt', type: 'file'},
		{name: 'fixture/dir-fixture/', type: 'directory'}
	];

	// Const expectedSymlinks = [];

	vinylFs
		.src(['fixture/**/*', 'fixture/.symlink/**/*'], {cwd: __dirname, base: __dirname, resolveSymlinks: false})
		.pipe(gulpTar('archive.tar'))
		.pipe(gulpZip())
		.pipe(gulp.dest('dest', {cwd: __dirname}))
		.on('finish', onTargz);
});
