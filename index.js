var parse5 = require('parse5');
var validateTemplate = require('vue-template-validator');

function commentScript(content, lang) {
  var symbol = getCommentSymbol(lang)
  var lines = content.split(splitRE)
  return lines.map(function(line, index) {
      // preserve EOL
      if (index === lines.length - 1 && emptyRE.test(line)) {
        return ''
      } else {
        return symbol + (emptyRE.test(line) ? '' : ' ' + line)
      }
    })
    .join('\n');
}

function getCommentSymbol(lang) {
  return commentSymbols[lang] || '//'
}

function getAttribute(node, name) {
  if (node.attrs) {
    var i = node.attrs.length
    var attr
    while (i--) {
      attr = node.attrs[i]
      if (attr.name === name) {
        return attr.value
      }
    }
  }
}

// exports
module.exports = function(content, file, conf) {
  var fragment = parse5.parseFragment(content, {
    locationInfo: true
  });

  fragment.childNodes.forEach(function(node) {
    var type = node.tagName;
    var lang = getAttribute(node, 'lang');
    var src = getAttribute(node, 'src');
    var scoped = getAttribute(node, 'scoped') != null;
    var warnings = null;
    var map = null;
    var output;

    output = {
      template: null,
      style: null,
      script: null
    }

    // node count check
    if (
      (type === 'script' || type === 'template') &&
      output[type].length > 0
    ) {
      throw new Error(
        '[fis3-parser-vue-component] Only one <script> or <template> tag is ' +
        'allowed inside a Vue component.'
      )
    }

    // handle src imports
    if (src) {
      if (type === 'style') {
        output.styleImports.push({
          src: src,
          lang: lang,
          scoped: scoped
        })
      } else if (type === 'template') {
        output.template.push({
          src: src,
          lang: lang
        })
      } else if (type === 'script') {
        output.script.push({
          src: src,
          lang: lang
        })
      }
      return
    }

    // skip empty script/style tags
    if (type !== 'template' && (!node.childNodes || !node.childNodes.length)) {
      return
    }

    // template content is nested inside the content fragment
    if (type === 'template') {
      node = node.content
      if (!lang) {
        warnings = validateTemplate(node, content)
      }
    }


  return content;
};
