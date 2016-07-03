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
  var templateFileName, templateFile, templateContent;
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

  // template
  if (output['template'].length) {
    validateTemplate(output['template'][0].content).forEach(function(msg) {
      console.log(msg)
    })

    templateContent = fis.compile.partial(output['template'][0].content, file, {
      ext: 'template',
      isHtmlLike: true
    });
    scriptStr += '\nvar _vueTemplateString = ' + JSON.stringify(templateContent) + ';\n'
    scriptStr += '\nmodule && module.exports && (module.exports.template = _vueTemplateString);\n';
    scriptStr += '\nexports && exports.default && (exports.default.template = _vueTemplateString);\n';
  } else {
    scriptStr += '\nmodule && module.exports && (module.exports.template = "");\n';
    scriptStr += '\nexports && exports.default && (exports.default.template = "");\n';
  }

  // 部分内容以 js 的方式编译一次。如果要支持 es6 需要这么配置。
  // fis.match('*.vue:js', {
  //   parser: fis.plugin('babel-6.x')
  // })
  scriptStr = fis.compile.partial(scriptStr, file, 'js');

  // style
  output['style'].forEach(function(item, index) {
    if (item.content) {
      var styleFileName = file.realpathNoExt + '-vue-style-' + index + '.' + item.lang;
      var styleFile = fis.file.wrap(styleFileName);
      styleFile.cache = file.cache;
      styleFile.setContent(output['style'][0].content);
      fis.compile.process(styleFile);
      styleFile.links.forEach(function(derived) {
        file.addLink(derived);
      });
      file.derived.push(styleFile);
      file.addRequire(styleFile.getId());
    }
  });

  return scriptStr;
};
