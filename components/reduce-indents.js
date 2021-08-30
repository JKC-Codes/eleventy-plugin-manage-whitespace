module.exports = function reduceIndents(stringDetails, tabSize) {
	const smallestIndent = getSmallestIndent(stringDetails, tabSize);

	if(smallestIndent !== 0) {
		normaliseIndents(stringDetails, tabSize, smallestIndent);
	}
}


function getSmallestIndent(stringDetails, tabSize) {
	const preText = stringDetails.reduce((acc, cur) => {
		return acc += cur.content[cur.index];
	}, '');
	// Regex = positive lookbehind for start of line or new line + 0 or more spaces or tabs + a non-space or non-tab character
	const lineRegEx = /(?<=(?:^|\n))[ \t]*[^ \t]/g;
	let smallestIndent = Infinity;
	let match;

	while((match = lineRegEx.exec(preText)) !== null) {
		// Make sure it's not an empty line
		if(/\S/.test(match[0].slice(-1))) {
			const indentSize = match[0]
				.slice(0, -1)
				.replace(/\t/g, ' '.repeat(tabSize))
				.length;

			smallestIndent = Math.min(smallestIndent, indentSize);
		}

		if(smallestIndent === 0) {
			// No need to reduce indents
			break;
		}
	}

	return smallestIndent === Infinity ? 0 : smallestIndent;
}

function normaliseIndents(stringDetails, tabSize, smallestIndent) {
	// Keep the original string indices in sync with new string indices
	let indexOffset = 0;

	// Check from start of pre element
	reduceFirstIndent(0, smallestIndent);

	// Check at each new line
	stringDetails.forEach((stringDetail, index) => {
		indexOffset = 0;
		reduceAllIndents(index);
	})

	function reduceFirstIndent(index, spacesToRemove) {
		indexOffset = 0;

		if(!stringDetails[index]) {
			return;
		}

		const string = stringDetails[index].content[stringDetails[index].index];
		// Regex = start of string + one or more spaces or tabs
		const match = /^[ \t]+/.exec(string);

		if(match) {
			reduceIndent(match.index, index, spacesToRemove);
		}
		else if(string === '') {
			// Check next element
			reduceFirstIndent(index + 1, spacesToRemove);
		}
	}

	function reduceAllIndents(index) {
		const string = stringDetails[index].content[stringDetails[index].index];
		// Regex = positive lookbehind for a new line + one or more spaces or tabs
		const matchRegEx = /(?<=\n)[ \t]+/g;
		let match;

		while((match = matchRegEx.exec(string)) !== null) {
			reduceIndent(match.index + indexOffset, index, smallestIndent);
		}

		// Regex = new line at end of string
		if(/\n$/.test(string)) {
			// Check next element
			reduceFirstIndent(index + 1, smallestIndent);
		}
	}

	function reduceIndent(position, index, spacesToRemove) {
		const fullString = stringDetails[index].content[stringDetails[index].index];
		const start = fullString.slice(0, position);
		let end = fullString.slice(position);

		// Regex = start of string + one or more spaces or tabs
		end = end.replace(/^[ \t]+/, function(match) {
			let characters = match.split('');

			while(spacesToRemove > 0) {
				const removedCharacter = characters.shift();

				switch(removedCharacter) {
					// Space
					case ' ':
						spacesToRemove--;
						break;

					// Tab
					case '\t':
						spacesToRemove -= tabSize;

						// If there's a mix of spaces and tabs too many characters could be removed
						if(spacesToRemove < 0) {
							characters.unshift(' '.repeat(-spacesToRemove));
						}
						break;

					// End of string, check next element
					case undefined:
						reduceFirstIndent(index + 1, spacesToRemove);
						spacesToRemove = 0;
						break;

					// End of indent, re-add removed character
					default:
						characters.unshift(removedCharacter);
						spacesToRemove = 0;
						break;
				}
			}

			return characters.join('');
		});

		if(typeof indexOffset !== 'undefined') {
			// Keep the original string indices in sync with new string indices
			indexOffset -= fullString.length - (start + end).length;
		}

		stringDetails[index].content[stringDetails[index].index] = start + end;
	}
}