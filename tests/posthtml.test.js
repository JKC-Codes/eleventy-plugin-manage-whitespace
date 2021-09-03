const test = require('ava');
const PostHTML = require('posthtml');
const { posthtml, parser } = require('../index.js');

const defaultOptions = {
	reduceIndents: true,
	tabSize: 4,
	trimWhitespace: true
};


function manageWhitespace(HTMLString, options) {
	return PostHTML([posthtml(options)])
		.process(HTMLString)
		.then(result => result.html);
}


test('Can be used directly with PostHTML', async t => {
	return manageWhitespace(`<pre>  line1
    line2</pre>`)
	.then(result => {
		t.is(result, `<pre>line1
  line2</pre>`);
	});
});


test('Can be used with custom options by PostHTML', async t => {
	return manageWhitespace(`<pre>
  foo
</pre>`, {trimWhitespace: false})
	.then(result => {
		t.is(result, `<pre>
foo
</pre>`);
	});
});


test('Can combine PostHTML and options parser', async t => {
	return manageWhitespace(`<pre>
  foo
</pre>`, {
		...defaultOptions,
		parsed: true,
		trimWhitespace: false
	})
	.then(result => {
		t.is(result, `<pre>
foo
</pre>`);
	});
});


test('Can use options parser separately', t => {
	t.deepEqual(parser(), {
		...defaultOptions,
		parsed: true
	});

	t.deepEqual(parser({reduceIndents: false}), {
		...defaultOptions,
		parsed: true,
		reduceIndents: false
	});

	t.deepEqual(parser({tabSize: 4}), {
		...defaultOptions,
		parsed: true,
		tabSize: 4
	});

	t.deepEqual(parser({trimWhitespace: false}), {
		...defaultOptions,
		parsed: true,
		trimWhitespace: false
	});
});