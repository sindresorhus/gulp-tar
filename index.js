import process from 'node:process';
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
			const isDirectory = file.isNull();
			let mode = file.stat?.mode;

			// On Windows, directories often lack execute permissions in file.stat.mode,
			// causing "Permission denied" errors when extracting on Unix systems.
			// Let archiver use proper defaults by setting mode to null for directories
			// when the mode lacks execute permissions.
			if (isDirectory && mode && process.platform === 'win32') {
				const hasExecute = (mode & 0o111) !== 0; // eslint-disable-line no-bitwise
				if (!hasExecute) {
					mode = null;
				}
			}

			archive.append(file.contents, {
				name: nameNormalized + (isDirectory ? '/' : ''),
				mode,
				date: file.stat?.mtime ?? null,
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
