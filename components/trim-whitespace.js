module.exports = function trimWhitespace(details) {
	// Trim start of pre
	for(let i = 0; i < details.length; i++) {
		// Regex = non-whitespace character; i.e. not an empty string
		if(/\S/.test(details[i].content[details[i].index])) {
			details[i].content[details[i].index] = details[i].content[details[i].index].trimStart();
			break;
		}
		else {
			details[i].content[details[i].index] = '';
		}
	}

	// Trim end of pre
	for(let i = details.length - 1; i >= 0; i--) {
		// Regex = non-whitespace character; i.e. not an empty string
		if(/\S/.test(details[i].content[details[i].index])) {
			details[i].content[details[i].index] = details[i].content[details[i].index].trimEnd();
			break;
		}
		else {
			details[i].content[details[i].index] = '';
		}
	}
}