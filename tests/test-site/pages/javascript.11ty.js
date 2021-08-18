class page {
	data() {
		return {
			title: "JavaScript"
		};
	}

	render({tests}) {
		return tests.reduce((acc, cur) => {
			return `${acc}<pre>${cur}</pre>
`;
		}, '');
	}
}

module.exports = page;