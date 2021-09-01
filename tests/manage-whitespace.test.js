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


test('Reduces indents', t => {
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
`<pre>		line1
			line2</pre>`, {reduceIndents: true}),
`<pre>line1
	line2</pre>`);

	t.is(manageWhitespace(
`<pre>    line1
  line2</pre>`, {reduceIndents: true}),
`<pre>  line1
line2</pre>`);

	t.is(manageWhitespace(
`<pre>     line1
      line2
     line3
          line4</pre>`, {reduceIndents: true}),
`<pre>line1
 line2
line3
     line4</pre>`);

	t.is(manageWhitespace(
`<pre><span>  line1</span>
    line2</pre>`, {reduceIndents: true}),
`<pre><span>line1</span>
  line2</pre>`);

	t.is(manageWhitespace(
`<pre><span>foo</span>  line1<span>
</span>    line2</pre>`, {reduceIndents: true}),
`<pre><span>foo</span>  line1<span>
</span>    line2</pre>`);

	t.is(manageWhitespace(
`<pre><span>  </span> line1<span>
</span>     line2</pre>`, {reduceIndents: true}),
`<pre><span></span>line1<span>
</span>  line2</pre>`);

	t.is(manageWhitespace(
`<pre>line1
  line2</pre>`, {reduceIndents: true}),
`<pre>line1
  line2</pre>`);

	t.is(manageWhitespace(
`<pre>   line1
<span>  </span>  line2</pre>`, {reduceIndents: true}),
`<pre>line1
<span></span> line2</pre>`);

	t.is(manageWhitespace(
`<div>line1
  line2</div>`, {reduceIndents: true}),
`<div>line1
  line2</div>`);
});


test('Respects tab sizes', t => {
	t.is(manageWhitespace(
`<pre>  line1
		line2</pre>`, {reduceIndents: true, tabSize: 2}),
`<pre>line1
	line2</pre>`);

	t.is(manageWhitespace(
`<pre>    line1
		line2</pre>`, {reduceIndents: true, tabSize: 4}),
`<pre>line1
	line2</pre>`);

	t.is(manageWhitespace(
`<pre>	line1
    line2</pre>`, {reduceIndents: true, tabSize: 1}),
`<pre>line1
   line2</pre>`);

	t.is(manageWhitespace(
`<pre>	 line1
		line2</pre>`, {reduceIndents: true, tabSize: 2}),
`<pre>line1
 line2</pre>`);

	t.is(manageWhitespace(
`<pre>          line1
	  	line2</pre>`, {reduceIndents: true, tabSize: 4}),
`<pre>line1
line2</pre>`);

	t.is(manageWhitespace(
`<pre>		line1
	  	line2</pre>`, {reduceIndents: true, tabSize: 2}),
`<pre>line1
	line2</pre>`);

	t.is(manageWhitespace(
`<pre>		line1
  	  line2</pre>`, {reduceIndents: true, tabSize: 2}),
`<pre>line1
  line2</pre>`);
});


test('Trims whitespace from pre elements', t => {
	t.is(manageWhitespace(
`<pre>
line1
line2</pre>`, {trimWhitespace: true}),
`<pre>line1
line2</pre>`);

	t.is(manageWhitespace(
`<pre>
line1
line2
</pre>`, {trimWhitespace: false}),
`<pre>
line1
line2
</pre>`);

	t.is(manageWhitespace(
`<pre>line1
line2
</pre>`, {trimWhitespace: true}),
`<pre>line1
line2</pre>`);

	t.is(manageWhitespace(
`<pre>
line1
line2
</pre>`, {trimWhitespace: true}),
`<pre>line1
line2</pre>`);

	t.is(manageWhitespace(
`<pre>line1
line2
     </pre>`, {trimWhitespace: true}),
`<pre>line1
line2</pre>`);

	t.is(manageWhitespace(
`<pre>line1
line2
		</pre>`, {trimWhitespace: true}),
`<pre>line1
line2</pre>`);

	t.is(manageWhitespace(
`<pre>

line1
line2</pre>`, {trimWhitespace: true}),
`<pre>line1
line2</pre>`);

	t.is(manageWhitespace(
`<pre>line1
line2

</pre>`, {trimWhitespace: true}),
`<pre>line1
line2</pre>`);

	t.is(manageWhitespace(
`<pre>

line1
line2

</pre>`, {trimWhitespace: true}),
`<pre>line1
line2</pre>`);

	t.is(manageWhitespace(
`<pre>  <span>  line1</span>
line2</pre>`, {trimWhitespace: true}),
`<pre><span>line1</span>
line2</pre>`);

	t.is(manageWhitespace(
`<pre>line1
<span>line2  </span>  </pre>`, {trimWhitespace: true}),
`<pre>line1
<span>line2</span></pre>`);

t.is(manageWhitespace(
`<div>
line1
line2
</div>`, {trimWhitespace: true}),
`<div>
line1
line2
</div>`);
});


test('Ignores case sensitivity', t => {
	t.is(manageWhitespace(
`<PrE>  line1
    line2</PrE>`, {reduceIndents: true}),
`<PrE>line1
  line2</PrE>`);

	t.is(manageWhitespace(
`<PRE>  line1
    line2</PRE>`, {reduceIndents: true}),
`<PRE>line1
  line2</PRE>`);
});