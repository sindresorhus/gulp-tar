# [gulp](http://gulpjs.com)-tar [![Build Status](https://travis-ci.org/sindresorhus/gulp-tar.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-tar)

> Create [tarball](http://en.wikipedia.org/wiki/Tar_(computing)) from files


## Install

```bash
$ npm install --save-dev gulp-tar
```


## Usage

```js
var gulp = require('gulp');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');

gulp.task('default', function () {
	gulp.src('src/*')
		.pipe(tar('archive.tar'))
		.pipe(gzip())
		.pipe(gulp.dest('dist'));
});
```


## API

### tar(filename, basePath)
`filename` is the output file's name.

`basePath` is the path you want to start with, for example:

Assume your project is at `/home/work/project/`, and you want to tar path `/home/work/project/path/to/tar/`, if you don't provide basePath arg, the output tar file structure will look like `/path/to/tar/`, if you provide basePath as `path/to`, then the output tar file structure will look like `/tar`.

## License

[MIT](http://opensource.org/licenses/MIT) © [Sindre Sorhus](http://sindresorhus.com)
