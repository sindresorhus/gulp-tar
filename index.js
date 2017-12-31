'use strict';
const path = require('path');
const through = require('through2');
const archiver = require('archiver');
const PluginError = require('plugin-error');
const Vinyl = require('vinyl');

module.exports = (filename, options) => {
	if (!filename) {
		throw new PluginError('gulp-tar', '`filename` required');
	}

	let firstFile;
	const archive = archiver('tar', options);

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
		}, options));

		cb();
	}, function (cb) {
		if (firstFile === undefined) {
			cb();
			return;
		}

		archive.finalize();

		this.push(new Vinyl({
			cwd: firstFile.cwd,
			base: firstFile.base,
			path: path.join(firstFile.base, filename),
			contents: archive
		}));

		cb();
	});
};
