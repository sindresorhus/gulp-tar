'use strict';
var path = require('path');
var _ = require('lodash');
var gutil = require('gulp-util');
var through = require('through2');
var archiver = require('archiver');

module.exports = function (filename, options) {
	if (!filename) {
		throw new gutil.PluginError('gulp-tar', '`filename` required');
	}

	if (typeof options === 'undefined') {
		options = {};
	}

	var firstFile;
	var archive = archiver('tar');

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			return cb();
		}

		if (firstFile === undefined) {
			firstFile = file;
		}

		var relativePath = file.path.replace(file.cwd + path.sep, '');
		archive.append(file.contents, _.merge({ name: relativePath }, options));
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
