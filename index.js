'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var archiver = require("archiver");

module.exports = function (filename) {
	if (!filename) {
		throw new gutil.PluginError('gulp-tar', '`filename` required');
	}

	var firstFile;
	var archive = archiver('tar');

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (firstFile === undefined) {
			firstFile = file;
		}

		var relativePath = file.path.replace(file.cwd + path.sep, '');
		archive.append(file.contents, { name: relativePath } );
		cb();
	}, function (cb) {
		if (firstFile === undefined) {
			return cb();
		}

		archive.finalize();

		this.push(new gutil.File({
			cwd: firstFile.cwd,
			base: firstFile.cwd,
			path: path.join(firstFile.cwd, filename),
			contents: archive
		}));
		cb();
	});
};
