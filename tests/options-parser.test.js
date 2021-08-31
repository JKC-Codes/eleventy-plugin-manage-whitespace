const test = require('ava');
const parser = require('../components/options-parser.js');


test('Accepts boolean reduceIndents option', t => {
	t.true(parser({reduceIndents: true}).reduceIndents);
	t.false(parser({reduceIndents: false}).reduceIndents);
});


test('Rejects non-boolean reduceIndents options', t => {
	t.throws(()=> {parser({reduceIndents: 123})});
	t.throws(()=> {parser({reduceIndents: 'foo'})});
	t.throws(()=> {parser({reduceIndents: ['foo', 123]})});
	t.throws(()=> {parser({reduceIndents: {foo: 'bar'}})});
	t.throws(()=> {parser({reduceIndents: function(foo) {return 'bar';}})});
});


test('Accepts integer tabSize option', t => {
	t.like(parser({tabSize: 2}), {tabSize: 2});
	t.like(parser({tabSize: 4}), {tabSize: 4});
	t.like(parser({tabSize: 0}), {tabSize: 0});
	t.like(parser({tabSize: 1}), {tabSize: 1});
});


test('Rejects non-integer tabSize options', t => {
	t.throws(()=> {parser({tabSize: true})});
	t.throws(()=> {parser({tabSize: false})});
	t.throws(()=> {parser({tabSize: 2.5})});
	t.throws(()=> {parser({tabSize: -2})});
	t.throws(()=> {parser({tabSize: '4'})});
	t.throws(()=> {parser({tabSize: ['4', 2]})});
	t.throws(()=> {parser({tabSize: {foo: 'bar'}})});
	t.throws(()=> {parser({tabSize: function(foo) {return 'bar';}})});
});


test('Accepts boolean trimWhitespace option', t => {
	t.true(parser({trimWhitespace: true}).trimWhitespace);
	t.false(parser({trimWhitespace: false}).trimWhitespace);
});


test('Rejects non-boolean trimWhitespace options', t => {
	t.throws(()=> {parser({trimWhitespace: 123})});
	t.throws(()=> {parser({trimWhitespace: 'foo'})});
	t.throws(()=> {parser({trimWhitespace: ['foo', 123]})});
	t.throws(()=> {parser({trimWhitespace: {foo: 'bar'}})});
	t.throws(()=> {parser({trimWhitespace: function(foo) {return 'bar';}})});
});


test('Adds parsed key to options', t => {
	t.true(parser({reduceIndents: true}).parsed);
	t.true(parser({tabSize: 4}).parsed);
	t.true(parser({trimWhitespace: true}).parsed);
});


test('Ignores null or undefined options', t => {
	t.false(parser({reduceIndents: null}).hasOwnProperty('reduceIndents'));
	t.false(parser({reduceIndents: undefined}).hasOwnProperty('reduceIndents'));

	t.false(parser({tabSize: null}).hasOwnProperty('tabSize'));
	t.false(parser({tabSize: undefined}).hasOwnProperty('tabSize'));

	t.false(parser({trimWhitespace: null}).hasOwnProperty('trimWhitespace'));
	t.false(parser({trimWhitespace: undefined}).hasOwnProperty('trimWhitespace'));
});


test('Rejects invalid options', t => {
	t.throws(()=> {parser('foo')});
	t.throws(()=> {parser({bar: 'baz'})});
	t.throws(()=> {parser({reduceindents: true})});
	t.throws(()=> {parser({reduceIndent: true})});
});