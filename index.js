var path = require('path');
var parse5 = require('parse5');
var validateTemplate = require('vue-template-validator');

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

  fragment.childNodes.forEach(function(node) {
    var type = node.tagName;
    var lang = getAttribute(node, 'lang');
    var src = getAttribute(node, 'src');
    var scoped = getAttribute(node, 'scoped') != null;
    var warnings = null;

    if (!output[type]) return;

    if (!lang) {
      if (type == 'script') lang = 'js';
      if (type == 'style') lang = 'css';
      if (type == 'template') lang = 'html';
    }

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
    styleFile.setContent(output['style'][0].content);
    file.addRequire(styleFile.getId());
  });

  // template
  if (output['template'].length) {
    validateTemplate(output['template'][0].content).forEach(function(msg) {
      console.log(msg)
    })
    templateFileName = file.subpathNoExt + '_vue_template' + '.' + output['template'][0].lang;
    templateFile = fis.file.wrap(templateFileName);
    templateFile.setContent(output['template'][0].content);
    scriptStr += '\nmodule.exports.template=__inline("' + templateFileName + '");\n';
  } else {
    scriptStr += '\nmodule.exports.template="";\n';
  }

  return scriptStr;
};
