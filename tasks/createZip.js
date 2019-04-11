// require modules
const fs = require('fs');
const archiver = require('archiver');

const {version, buildDir, distDir} = require('../buildConfig');

// check that build exists
console.log(buildDir);
console.log(distDir);
if (!fs.existsSync(distDir)) {
	throw new Error('production build does not exist. run `npm run build` first.');
}

// create a file to stream archive data to.
if (!fs.existsSync(buildDir)) {
	fs.mkdirSync(buildDir);
}

const output = fs.createWriteStream(`${buildDir}/release-${version}.zip`);
const archive = archiver('zip', { zlib: { level: 9 } });

archive
	.on('warning', function (err) {
		if (err.code === 'ENOENT') {
			console.warn(err);
		} else {
			throw err;
		}
	})
	.on('error', function (err) {
		throw err;
	});

archive.pipe(output);
archive.glob('**/*', {cwd: distDir});
archive.finalize();
