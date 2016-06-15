var path = require('path');
var parserVuePlugin = require('../index');

// 需要构建的文件
fis.set('project.fileType.text', 'vue');
fis.set('project.files', ['src/**']);
fis.set('project.ignore', fis.get('project.ignore').concat(['output/**', 'DS_store']));

// 模块化支持插件
// https://github.com/fex-team/fis3-hook-commonjs (forwardDeclaration: true)
fis.hook('commonjs', {
  extList: [
    '.js', '.coffee', '.es6', '.jsx',
  ],
  umd2commonjs: true,
  ignoreDependencies: [

  ]
});

// 模块文件，会进行require包装
fis.match('/{node_modules,src}/**.{js,jsx}', {
  isMod: true,
  useSameNameRequire: true,
});

// vue
fis.match('src/**.vue', {
  rExt: 'js',
  useSameNameRequire: true,
  parser: [parserVuePlugin]
});

fis.match('**', {
  release: '$&'
});

// 用 less 解析
fis.match('*.less', {
  rExt: 'css',
  parser: [fis.plugin('less-2.x')],
  postprocessor: fis.plugin('autoprefixer'),
});

fis.match('::package', {
  postpackager: fis.plugin('loader'),
});

// 禁用components
fis.unhook('components');
fis.hook('node_modules');

fis
  .media('local')
  .match('**', {
    deploy: fis.plugin('local-deliver', {
      to: path.join(__dirname, './output/')
    })
  });
