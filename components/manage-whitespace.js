const trimWhitespace = require('./trim-whitespace.js');
const reduceIndents = require('./reduce-indents.js');

module.exports = function(globalOptions) {
	// AST = Abstract Syntax Tree from HTML Parser
	return function(AST) {
		AST.walk(node => {
			if(node.tag && node.tag.toLowerCase() === 'pre') {
				const options = updateOptions(node, globalOptions);
				const stringDetails = getStringDetails(node);

				if(options.reduceIndents) {
					reduceIndents(stringDetails, options.tabSize);
				}

				if(options.trimWhitespace) {
					trimWhitespace(stringDetails);
				}

				// Remove empty content
				if(node.content) {
					node.content = node.content.filter(child => child);

					if(node.content.length === 0) {
						delete node.content;
					}
				}
			}

			return node;
		});

		return AST;
	}
}


function updateOptions(node, globalOptions) {
	const newOptions = {};

	if(node.attrs) {
		// Can't access key directly because of case sensitivity
		for(let [key, value] of Object.entries(node.attrs)) {
			if(key.toLowerCase() === 'data-reduceindents') {
				value = value.toLowerCase();

				if(value === 'true' || value === 'false') {
					newOptions.reduceIndents = value === 'true' ? true : false;
					delete node.attrs[key];
				}
			}
			else if(key.toLowerCase() === 'data-tabsize') {
				value = parseInt(value, 10);

				if(value >= 0) {
					newOptions.tabSize = value;
					delete node.attrs[key];
				}
			}
			else if(key.toLowerCase() === 'data-trimwhitespace') {
				value = value.toLowerCase();

				if(value === 'true' || value === 'false') {
					newOptions.trimWhitespace = value === 'true' ? true : false;
					delete node.attrs[key];
				}
			}
		}

		// Remove empty attribute keys
		if(Object.keys(node.attrs).length === 0) {
			delete node.attrs;
		}
	}

	return Object.assign({}, globalOptions, newOptions);
}


function getStringDetails(node) {
	const stringDetails = [];

	function walkTree(node, index, content) {
		if(typeof node === 'string') {
			stringDetails.push({content: content, index: index});
		}
		else if(node.hasOwnProperty('content')) {
			node.content.forEach((child, childIndex) => {
				walkTree(child, childIndex, node.content);
			})
		}
	}

	walkTree(node, 0, node.content);

	return stringDetails;
}