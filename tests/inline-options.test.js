const test = require('ava');
const PostHTML = require('posthtml');
const { posthtml: manageWhitespacePlugin } = require('../index.js');


function manageWhitespace(HTMLString, options) {
	options = Object.assign({
		reduceIndents: false,
		tabSize: 2,
		trimWhitespace: false
	}, options);

	return PostHTML()
		.use(manageWhitespacePlugin(options))
		.process(HTMLString, { sync: true })
		.html;
}


test('ReduceIndents can be toggled', t => {
	t.is(manageWhitespace(
`<pre>  line1
    line2</pre>`, {reduceIndents: true}),
`<pre>line1
  line2</pre>`);

	t.is(manageWhitespace(
`<pre>  line1
    line2</pre>`, {reduceIndents: false}),
`<pre>  line1
    line2</pre>`);

	t.is(manageWhitespace(
`<pre data-reduceIndents="false">  line1
    line2</pre>`, {reduceIndents: true}),
`<pre>  line1
    line2</pre>`);

	t.is(manageWhitespace(
`<pre data-reduceIndents="true">  line1
    line2</pre>`, {reduceIndents: false}),
`<pre>line1
  line2</pre>`);
});


test('TabSize can be changed', t => {
	t.is(manageWhitespace(
`<pre>    line1
		line2</pre>`, {reduceIndents: true, tabSize: 4}),
`<pre>line1
	line2</pre>`);

	t.is(manageWhitespace(
`<pre>    line1
				line2</pre>`, {reduceIndents: true, tabSize: 1}),
`<pre>line1
line2</pre>`);

t.is(manageWhitespace(
	`<pre data-tabsize="4">    line1
			line2</pre>`, {reduceIndents: true, tabSize: 2}),
	`<pre>line1
		line2</pre>`);

	t.is(manageWhitespace(
`<pre data-tabsize="1">    line1
				line2</pre>`, {reduceIndents: true, tabSize: 2}),
`<pre>line1
line2</pre>`);
});


test('Trim can be toggled', t => {
	t.is(manageWhitespace(
`<pre>
line1
</pre>`, {trimWhitespace: true}),
`<pre>line1</pre>`);

	t.is(manageWhitespace(
`<pre>
line1
</pre>`, {trimWhitespace: false}),
`<pre>
line1
</pre>`);

	t.is(manageWhitespace(
`<pre data-trimwhitespace="false">
line1
</pre>`, {trimWhitespace: true}),
`<pre>
line1
</pre>`);

	t.is(manageWhitespace(
`<pre data-trimwhitespace="true">
line1
</pre>`, {trimWhitespace: false}),
`<pre>line1</pre>`);
});


test('Inline options ignore casing', t => {
	t.is(manageWhitespace(
`<pre dAtA-rEdUcEiNdEnTs="TrUe" dAtA-tAbSiZe="4" dAtA-tRiMwHiTeSpAcE="tRuE">
    line1
		line2
</pre>`),
`<pre>line1
	line2</pre>`);
});