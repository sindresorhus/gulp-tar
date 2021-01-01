# gulp-tar

> Create [tarball](https://en.wikipedia.org/wiki/Tar_(computing)) from files


## Install

```
$ npm install --save-dev gulp-tar
```


## Usage

```js
const gulp = require('gulp');
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');

exports.default = () => (
	gulp.src('src/*')
		.pipe(tar('archive.tar'))
		.pipe(gzip())
		.pipe(gulp.dest('dist'))
);
```


## API

### tar(filename, options?)

#### filename

Type: `string`

Filename for the output tar archive.

#### options

Type: `object`

Default options passed to [Archiver](https://github.com/archiverjs/node-archiver)'s [constructor](https://archiverjs.com/docs/Archiver.html) and merged into the [data](https://archiverjs.com/docs/global.html#TarEntryData) passed to its [`append`](https://archiverjs.com/docs/Archiver.html#append) method.
