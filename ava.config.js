export default {
	files: [
		'src/**/*spec.ts',
	],
	sources: [
		'src/**/*.ts',
	],
	compileEnhancements: false,
	verbose: true,
	extensions: ["ts"],
	require: [
		"ts-node/register/transpile-only"
	]
};
