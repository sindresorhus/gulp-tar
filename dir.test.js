/* eslint-env mocha */
const {createReadStream} = require('fs');
const path = require('path');
const zlib = require('zlib');
const assert = require('assert');
const gulp = require('gulp');
const gulpZip = require('gulp-gzip');
const tarfs = require('tar-fs');
const rimraf = require('rimraf');

const gulpTar = require('.');

it('should include dirs', done => {
	const expectedNames = ['dir-fixture/inside.txt', 'fixture.txt'];
	gulp
		.src('fixture/**/*')
		.pipe(gulpTar('archive.tar'))
		.pipe(gulpZip())
		.pipe(gulp.dest('dest'))
		.on('finish', onTargz);

	function onTargz() {
		const filename = 'archive.tar.gz';
		const fullPath = path.join(__dirname, 'dest', filename);
		const rs = createReadStream(fullPath);

		rs.pipe(zlib.createGunzip())
			.pipe(
				tarfs.extract(path.join(__dirname, 'dest-out'), {
					mapStream: (filestream, header) => {
						const expected = expectedNames.pop();
						assert.strictEqual(header.name, expected);
						return filestream;
					}
				})
			)
			.on('finish', () => {
				['dest', 'dest-out'].map(dir => rimraf.sync(path.join(__dirname, dir)));
				done();
			});
	}
});
