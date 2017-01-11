var parseHTML = require('./html-parser');
var deindent = require('de-indent');

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

var splitRE = /\r?\n/g;
var isSpecialTag$1 = makeMap('script,style,template', true);

/**
 * Parse a single-file component (*.vue) file into an SFC Descriptor Object.
 */
function parseComponent (
  content,
  options
 ) {
  if ( options === void 0 ) options = {};

  var sfc = {
    template: null,
    script: null,
    styles: [],
    customBlocks: []
  };
  var depth = 0;
  var currentBlock = null;

  function start (
    tag,
    attrs,
    unary,
    start,
    end
  ) {
    if (depth === 0) {
      if (isSpecialTag$1(tag)) {
        currentBlock = {
          type: tag,
          content: '',
          start: end
        };
        checkAttrs(currentBlock, attrs);
        if (tag === 'style') {
          sfc.styles.push(currentBlock);
        } else {
          sfc[tag] = currentBlock;
        }
      } else { // custom blocks
        currentBlock = {
          type: tag,
          content: '',
          start: end,
          attrs: attrs.reduce(function (cumulated, ref) {
            var name = ref.name;
            var value = ref.value;

            cumulated[name] = value;
            return cumulated
          }, Object.create(null))
        };
        sfc.customBlocks.push(currentBlock);
      }
    }
    if (!unary) {
      depth++;
    }
  }

  function checkAttrs (block, attrs) {
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if (attr.name === 'lang') {
        block.lang = attr.value;
      }
      if (attr.name === 'scoped') {
        block.scoped = true;
      }
      if (attr.name === 'module') {
        block.module = attr.value || true;
      }
      if (attr.name === 'src') {
        block.src = attr.value;
      }
    }
  }

  function end (tag, start, end) {
    if (depth === 1 && currentBlock) {
      currentBlock.end = start;
      var text = deindent(content.slice(currentBlock.start, currentBlock.end));
      // pad content so that linters and pre-processors can output correct
      // line numbers in errors and warnings
      if (currentBlock.type !== 'template' && options.pad) {
        text = padContent(currentBlock) + text;
      }
      currentBlock.content = text;
      currentBlock = null;
    }
    depth--;
  }

  function padContent (block) {
    var offset = content.slice(0, block.start).split(splitRE).length;
    var padChar = block.type === 'script' && !block.lang
      ? '//\n'
      : '\n';
    return Array(offset).join(padChar)
  }

  parseHTML(content, {
    start: start,
    end: end,
    sfc: true
  });

  return sfc
}

exports.parseComponent = parseComponent;
