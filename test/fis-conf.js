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
    '.js', '.coffee', '.es6', '.jsx', '.vue',
  ],
  umd2commonjs: true,
  ignoreDependencies: [

  ]
});

// 用 less 解析
fis.match('*.less', {
  rExt: 'css',
  parser: [fis.plugin('less-2.x')],
  postprocessor: fis.plugin('autoprefixer'),
});

// vue
fis.match('src/**.vue', {
  isMod: true,
  rExt: 'js',
  useSameNameRequire: true,
  parser: [
    // parserVuePlugin,
    fis.plugin('vue-component'),
    fis.plugin('babel-6.x', {
      presets: ['es2015-loose', 'react', 'stage-3']
    }),
    fis.plugin('translate-es3ify', null, 'append')
  ]
});

fis.match('**.js', {
  isMod: true,
  rExt: 'js',
  useSameNameRequire: true
});

// 模块文件，会进行require包装
fis.match('/src/**.js', {
  parser: [
    fis.plugin('babel-6.x', {
      presets: ['es2015-loose', 'react', 'stage-3']
    }),
    fis.plugin('translate-es3ify', null, 'append')
  ]
});

// no modules
fis.match('/src/js/engine/**.js', {
  parser: null,
  isMod: false
});

fis.match('/src/js/page/**.js', {
  isMod: false
});

fis.match('/src/(**)', {
  release: '$1'
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
