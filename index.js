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

	return through.obj((file, encoding, callback) => {
		if (file.relative === '') {
			callback();
			return;
		}

		if (firstFile === undefined) {
			firstFile = file;
		}

		const nameNormalized = file.relative.replace(/\\/g, '/');

		if (file.isSymbolic()) {
			archive.symlink(nameNormalized, file.symlink);
		} else {
			archive.append(file.contents, {
				name: nameNormalized + (file.isNull() ? '/' : ''),
				mode: file.stat && file.stat.mode,
				date: file.stat && file.stat.mtime ? file.stat.mtime : null,
				...options
			});
		}

		callback();
	}, function (callback) {
		if (firstFile === undefined) {
			callback();
			return;
		}

		archive.finalize();

		this.push(new Vinyl({
			cwd: firstFile.cwd,
			base: firstFile.base,
			path: path.join(firstFile.base, filename),
			contents: archive
		}));

		callback();
	});
};
