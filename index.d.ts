import type {Transform} from 'node:stream';
import type archiver from 'archiver';

export type Options = archiver.ArchiverOptions & Omit<archiver.TarEntryData, 'mode'> & {
	/**
	Entry permissions. When `null`, uses Archiver defaults (directories: 0755, files: 0644).
	*/
	mode?: number | null; // eslint-disable-line @typescript-eslint/no-restricted-types
};

/**
Create tarball from files.

@param filename - Output tar archive filename.
@param options - Options passed to Archiver.
@returns Transform stream that creates a tar archive.

@example
```
import gulp from 'gulp';
import tar from 'gulp-tar';

export default () => (
	gulp.src('src/*')
		.pipe(tar('archive.tar'))
		.pipe(gulp.dest('dist'))
);
```
*/
export default function gulpTar(filename: string, options?: Options): Transform;
