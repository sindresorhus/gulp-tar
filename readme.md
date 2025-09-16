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

##### Cross-platform permissions

On Windows, directories created by the filesystem often lack execute permissions, which can cause "Permission denied" errors when extracting tarballs on Unix systems. This package automatically detects and fixes this issue on Windows by letting Archiver use proper defaults for directories without execute permissions.

If you need to explicitly control this behavior, you can use `{mode: null}` to always use Archiver's defaults, regardless of the source file permissions.
