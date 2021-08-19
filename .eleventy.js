const manageWhitespace = require('./index.js');


module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(manageWhitespace, {
		reduceIndents: true,
		tabSize: 2,
		trimWhitespace: true,
	});

	return {
		dir: {
			input: './tests/test-site/',
			output: './tests/test-site/_site'
		}
	};
};