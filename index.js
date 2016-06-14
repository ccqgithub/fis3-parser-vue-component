var path = require('path');
var parse5 = require('parse5');
var validateTemplate = require('vue-template-validator');
var deindent = require('de-indent');

function getAttribute(node, name) {
  if (node.attrs) {
    var i = node.attrs.length;
    var attr;
    while (i--) {
      attr = node.attrs[i];
      if (attr.name === name) {
        return attr.value;
      }
    }
  }
}

// exports
module.exports = function(content, file, conf) {
  var scriptStr = '';
  var templateFileName, templateFile;
  var fragment = parse5.parseFragment(content, {
    locationInfo: true
  });
  var output = {
    template: [],
    style: [],
    script: []
  };

  function getContent(node) {
    var start, end;
    if (!node.childNodes || !node.childNodes.length) return '';
    start = node.childNodes[0].__location.startOffset;
    end = node.childNodes[node.childNodes.length - 1].__location.endOffset;
    return content.slice(start, end);
  }

  fragment.childNodes.forEach(function(node) {
    var type = node.tagName;
    var lang = getAttribute(node, 'lang');
    var src = getAttribute(node, 'src');
    var scoped = getAttribute(node, 'scoped') != null;
    var warnings = null;
    var content;

    if (!output[type]) return;

    if (type == 'style' && (!node.childNodes || !node.childNodes.length)) {
      return;
    }

    if (!lang) {
      if (type == 'script') lang = 'js';
      if (type == 'style') lang = 'css';
      if (type == 'template') lang = 'html';
    }

    if (type == 'template') {
      content = parse5.serialize(node.content);
    } else {
      content = getContent(node);
    }

    content = deindent(content);
    content = content.replace(/(^[\r\n]*)|([\r\n]*$)/g, '');

    // node count check
    if ((type === 'script' || type === 'template') && output[type].length > 0) {
      throw new Error(
        '[fis3-parser-vue-component] Only one <script> or <template> tag is ' +
        'allowed inside a Vue component.'
      )
    } else {
      output[type].push({
        content: node.content,
        lang: lang
      });
    }
  });

  // script
  if (output['script'].length) {
    scriptStr = output['script'][0].content;
  } else {
    scriptStr += 'module.exports = {}';
  }

  // style
  output['style'].forEach(function(item, index) {
    var styleFileName = file.subpathNoExt + '_vue_style_' + index + '.' + item.lang;
    var styleFile = fis.file.wrap(styleFileName);
    styleFile.cache = file.cache;
    styleFile.setContent(output['style'][0].content);
    fis.compile.process(styleFile);
    styleFile.links.forEach(function(derived) {
      file.addLink(derived);
    });
    file.derived.push(styleFile);
    file.addRequire(styleFile.getId());
  });

  // template
  if (output['template'].length) {
    validateTemplate(output['template'][0].content).forEach(function(msg) {
      console.log(msg)
    })
    templateFileName = file.subpathNoExt + '_vue_template' + '.' + output['template'][0].lang;
    templateFile = fis.file.wrap(templateFileName);
    templateFile.cache = file.cache;
    templateFile.setContent(output['template'][0].content);
    fis.compile.process(templateFile);
    templateFile.links.forEach(function(derived) {
      file.addLink(derived);
    });
    file.derived.push(templateFile);
    scriptStr += '\nmodule.exports.template="' + templateFile.getContent() + '";\n';
  } else {
    scriptStr += '\nmodule.exports.template="";\n';
  }

  return scriptStr;
};
