'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var tar = require('tar-stream');

module.exports = function (filename, rootDir) {
	if (!filename) {
		throw new gutil.PluginError('gulp-tar', '`filename` required');
	}
	rootDir = rootDir ? (rootDir + path.sep) : '';

	var firstFile;
	var pack = tar.pack();

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-tar', 'Streaming not supported'));
			return cb();
		}

		if (firstFile === undefined) {
			firstFile = file;
		}

		var relativePath = file.path.replace(file.cwd + path.sep + rootDir, '');
		pack.entry({name: relativePath}, file.contents);
		cb();
	}, function (cb) {
		if (firstFile === undefined) {
			return cb();
		}

		pack.finalize();
		this.push(new gutil.File({
			cwd: firstFile.cwd,
			base: firstFile.cwd,
			path: path.join(firstFile.cwd, filename),
			contents: pack
		}));
		cb();
	});
};
