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
  var fragment = parse5.parseFragment(content.toString(), {
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
      content = parse5.serialize(node);
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
        content: content,
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
    var styleFileName = file.realpathNoExt + '_vue_style_' + index + '.' + item.lang;
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
    templateFileName = file.realpathNoExt + '_vue_template' + '.' + output['template'][0].lang;
    templateFile = fis.file.wrap(templateFileName);
    templateFile.cache = file.cache;
    templateFile.release = false;
    templateFile.setContent(output['template'][0].content);
    fis.compile.process(templateFile);
    templateFile.links.forEach(function(derived) {
      file.addLink(derived);
    });
    // file.derived.push(templateFile);
    scriptStr += '\nmodule && module.exports && (module.exports.template = ' + JSON.stringify(templateFile.getContent()) + ');\n';
    scriptStr += '\nexports && exports.default && (exports.default.template = ' + JSON.stringify(templateFile.getContent()) + ');\n';
  } else {
    scriptStr += '\nmodule && module.exports && (module.exports.template = "");\n';
    scriptStr += '\nexports && exports.default && (exports.default.template = "");\n';
  }

  return scriptStr;
};
