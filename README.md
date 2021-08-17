# Manage Whitespace
An [11ty](https://www.11ty.dev/) plugin that removes whitespace margins and leading/trailing whitespace in `pre` elements.


- [Installation](#installation)
- [Usage](#usage)
  - [PostHTML](#posthtml)
- [Configuration](#configuration)
  - [reduceIndents](#reduceindents)
  - [tabSize](#tabsize)
  - [trimWhitespace](#trimwhitespace)
- [Inline Options](#inline-options)
- [Licence](#licence)


## Installation

```shell
npm install eleventy-plugin-manage-whitespace
```


## Usage

In your [Eleventy config file](https://www.11ty.dev/docs/config/) (`.eleventy.js` by default):
```js
const manageWhitespace = require('eleventy-plugin-manage-whitespace');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(manageWhitespace);
}
```


### PostHTML
If you're already using [PostHTML](https://posthtml.org/) you can reduce build times by using the `posthtml` export as a plugin to your existing PostHTML syntax tree. It provides a stand-alone PostHTML version of Manage Whitespace that can even be used outside of Eleventy.

The optional `parser` export further reduces build times when using PostHTML with Eleventy's `--watch` or `--serve` arguments. Parsing your options outside of the transform will mean it's only done once at the start of watching or serving rather than every time Eleventy builds.

```js
const posthtml = require('posthtml');
const anotherPostHTMLPlugin = require('another-posthtml-plugin');
const { posthtml: manageWhitespace, parser } = require('eleventy-plugin-manage-whitespace');
const options = parser({tabSize: 2});

module.exports = function(eleventyConfig) {
  eleventyConfig.addTransform('posthtml', function(HTMLString, outputPath) {
    if(outputPath && outputPath.endsWith('.html')) {
      return posthtml([manageWhitespace(options), anotherPostHTMLPlugin()])
        .process(HTMLString)
        .then(result => result.html));
    }
    else {
      return HTMLString;
    }
  });
}
```


## Configuration
```js
const manageWhitespace = require('eleventy-plugin-manage-whitespace');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(manageWhitespace, {
    reduceIndents: true,
    tabSize: 4,
    trimWhitespace: true
  });
}
```


### reduceIndents
- Default: true
- Accepts: Boolean

Remove whitespace from the start of lines so that any margin caused by whitespace is removed. For example:
```js
// Before:
    function() { // indented 4 spaces
      return; // indented 6 spaces
    }// indented 4 spaces

// After:
function() { // not indented
  return; // indented 2 spaces
} // not indented
```


### tabSize
- Default: 4
- Accepts: positive Integer

The number of spaces a tab character represents when calculating indent width and there is a mix of tabs and spaces.

This will not change the visual width of tab characters; Use the [`tab-size` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/tab-size) for that.


### trimWhitespace
- Default: true
- Accepts: Boolean

Remove whitespace from the start and end of `pre` blocks.


## Inline Options
The global options defined in your Eleventy config file can be superseded by adding a data attribute on the `pre` element.

The following attributes will supersede the accompanying global option on that `pre` element:

- `data-reduceIndents="true/false"`
- `data-tabSize="123"`
- `data-trimWhitespace="true/false"`


## Licence
[MPL-2.0](https://choosealicense.com/licenses/mpl-2.0/)