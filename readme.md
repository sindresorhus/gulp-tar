# gulp-tar

> Create [tarball](https://en.wikipedia.org/wiki/Tar_(computing)) from files

## Install

```sh
npm install --save-dev gulp-tar
```

## Usage

```js
import gulp from 'gulp';
import tar from 'gulp-tar';
import gzip from 'gulp-gzip';

export default () => (
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

The filename for the output tar archive.

#### options

Type: `object`

Default options passed to [Archiver](https://github.com/archiverjs/node-archiver)'s [constructor](https://archiverjs.com/docs/Archiver.html) and merged into the [data](https://archiverjs.com/docs/global.html#TarEntryData) passed to its [`append`](https://archiverjs.com/docs/Archiver.html#append) method.
