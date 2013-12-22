'use strict';
var path = require('path');
var es = require('event-stream');
var gutil = require('gulp-util');
var tar = require('tar-stream');

module.exports = function (filename) {
	if (!filename) {
		throw new Error('Missing filename.');
	}

	var firstFile;
	var pack = tar.pack();

	return es.through(function (file) {
		if (!firstFile) {
			firstFile = file;
		}

		var relativePath = file.path.replace(file.cwd + '/', '');
		pack.entry({name: relativePath}, file.contents);
	}, function () {
		if (!firstFile) {
			return this.emit('end');
		}

		pack.finalize();

		var joinedPath = path.join(firstFile.cwd, filename);
		var joinedFile = new gutil.File({
			cwd: firstFile.cwd,
			base: firstFile.cwd,
			path: joinedPath,
			contents: pack
		});

		this.emit('data', joinedFile);
		this.emit('end');
	});
};
