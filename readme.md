# [gulp](https://github.com/wearefractal/gulp)-tar [![Build Status](https://secure.travis-ci.org/sindresorhus/gulp-tar.png?branch=master)](http://travis-ci.org/sindresorhus/gulp-tar)

> Create [tarball](http://en.wikipedia.org/wiki/Tar_(computing\)) from files


## Install

Install with [npm](https://npmjs.org/package/gulp-tar)

```
npm install --save-dev gulp-tar
```


## Example

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

### tar(filename)


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
