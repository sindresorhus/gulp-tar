import path from 'node:path';
import archiver from 'archiver';
import Vinyl from 'vinyl';
import {gulpPlugin} from 'gulp-plugin-extras';

export default function gulpTar(filename, options) {
	if (!filename) {
		throw new Error('gulp-tar: `filename` required');
	}

	let firstFile;
	const archive = archiver('tar', options);

	return gulpPlugin('gulp-tar', async file => {
		if (file.relative === '') {
			return;
		}

		if (firstFile === undefined) {
			firstFile = file;
		}

		const nameNormalized = file.relative.replaceAll('\\', '/');

		if (file.isSymbolic()) {
			archive.symlink(nameNormalized, file.symlink);
		} else {
			archive.append(file.contents, {
				name: nameNormalized + (file.isNull() ? '/' : ''),
				mode: file.stat && file.stat.mode,
				date: file.stat && file.stat.mtime ? file.stat.mtime : null,
				...options,
			});
		}
	}, {
		supportsAnyType: true,
		async * onFinish() {
			if (firstFile === undefined) {
				return;
			}

			archive.finalize();

			yield new Vinyl({
				cwd: firstFile.cwd,
				base: firstFile.base,
				path: path.join(firstFile.base, filename),
				contents: archive,
			});
		},
	});
}
