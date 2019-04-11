const path = require('path');

const {name, description, version} = require('./package.json');
const buildDir = path.join(__dirname + '/build');
const distDir = path.join(__dirname + '/dist');

module.exports = {
	name,
	description,
	version,
	buildDir,
	distDir,
};
