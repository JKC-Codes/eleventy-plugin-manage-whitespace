module.exports = function(userOptions = {}) {
	const parsedOptions = {};

	for(const [key, value] of Object.entries(userOptions)) {
		if(value === undefined || value === null) {
			continue;
		}

		switch(key) {
			case 'reduceIndents':
			case 'trimWhitespace':
				Object.assign(parsedOptions, validateBoolean(key, value));
			break;

			case 'tabSize': Object.assign(parsedOptions, validateTabSize(value));
			break;

			default: throw new Error(`Manage Whitespace plugin received an unrecognised option: ${key}`);
		}
	}

	parsedOptions.parsed = true;
	return parsedOptions;
}


function validateBoolean(key, value) {
	if(typeof value !== 'boolean') {
		throw new Error(`Manage Whitespace plugin requires the ${key} option to be a Boolean. Received ${typeof value}: ${JSON.stringify(value)}`);
	}
	else {
		return {[key]: value};
	}
}

function validateTabSize(value) {
	if(Number.isInteger(value) && value >= 0) {
		return {tabSize: value};
	}
	else {
		throw new Error(`Manage Whitespace plugin requires the tabSize option to be a positive integer. Received ${typeof value}: ${JSON.stringify(value)}`);
	}
}