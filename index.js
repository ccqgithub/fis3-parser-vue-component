var path = require('path');
var parse5 = require('parse5');
var validateTemplate = require('vue-template-validator');
var deindent = require('de-indent');
var objectAssign = require('object-assign');
var vueComponentNum = 0;

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
  var fragment, output, configs, vuecId, jsLang;

  // configs
  configs = objectAssign({
    cssScopedFlag: 'vuec',
  }, conf);

  // 兼容content为buffer的情况
  content = content.toString();

  // scope replace
  vueComponentNum ++;
  vuecId = 'vue-component-' + vueComponentNum;
  content = content.replace(new RegExp(configs.cssScopedFlag, 'g'), vuecId);

  // parse
  fragment = parse5.parseFragment(content.toString(), {
    locationInfo: true
  });

  output = {
    template: [],
    style: [],
    script: []
  };

  fragment.childNodes.forEach(function(node) {
    var type = node.tagName;
    var lang = getAttribute(node, 'lang');
    var src = getAttribute(node, 'src');
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
    jsLang = output['script'][0].lang;
  } else {
    scriptStr += 'module.exports = {}';
    jsLang = 'js';
  }

  // template
  if (output['template'].length) {
    templateContent = fis.compile.partial(output['template'][0].content, file, {
      ext: output['template'][0].lang,
      isHtmlLike: true
    });

    validateTemplate(output['template'][0].content).forEach(function(msg) {
      console.log(msg)
    })

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
  scriptStr = fis.compile.partial(scriptStr, file, {
    ext: jsLang,
    isJsLike: true
  });

  // style
  output['style'].forEach(function(item, index) {
    if (item.content) {
	    var _index = (index == 0) ? '' : '_'+index;
      var styleFileName = file.realpathNoExt + _index + '.css';
      var styleFile = fis.file.wrap(styleFileName);
      var styleContent;

      // css也采用片段编译，更好的支持less、sass等其他语言
      styleContent = fis.compile.partial(item.content, file, {
        ext: item.lang,
        isCssLike: true
      });

      styleFile.cache = file.cache;
      styleFile.isCssLike = true;
      styleFile.setContent(styleContent);
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
