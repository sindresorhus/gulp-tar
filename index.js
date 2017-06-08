'use strict';
const path = require('path');
const gutil = require('gulp-util');
const through = require('through2');
const archiver = require('archiver');

module.exports = (filename, opts) => {
	if (!filename) {
		throw new gutil.PluginError('gulp-tar', '`filename` required');
	}

	let firstFile;
	const archive = archiver('tar', opts);

	return through.obj((file, enc, cb) => {
		if (file.relative === '') {
			cb();
			return;
		}

		if (firstFile === undefined) {
			firstFile = file;
		}

		archive.append(file.contents, Object.assign({
			name: file.relative.replace(/\\/g, '/') + (file.isNull() ? '/' : ''),
			mode: file.stat && file.stat.mode,
			date: file.stat && file.stat.mtime ? file.stat.mtime : null
		}, opts));

		cb();
	}, function (cb) {
		if (firstFile === undefined) {
			cb();
			return;
		}

		archive.finalize();

		this.push(new gutil.File({
			cwd: firstFile.cwd,
			base: firstFile.base,
			path: path.join(firstFile.base, filename),
			contents: archive
		}));

		cb();
	});
};
