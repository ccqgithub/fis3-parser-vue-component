var path = require('path');
var parserVuePlugin = require('../index');

// 需要构建的文件
fis.set('project.fileType.text', 'vue,map');
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

// 禁用components，启用node_modules
fis.unhook('components');
fis.hook('node_modules');

// 所有js文件
fis.match('**.js', {
  isMod: true,
  rExt: 'js',
  useSameNameRequire: true
});

// 编译vue组件
fis.match('src/**.vue', {
  isMod: true,
  rExt: 'js',
  useSameNameRequire: true,
  parser: [
    function(content, file, conf) {
      conf.runtimeOnly = true;
      return parserVuePlugin(content, file, conf);
    },
  ]
});

fis.match('src/**.vue:js', {
  isMod: true,
  rExt: 'js',
  useSameNameRequire: true,
  parser: [
    fis.plugin('babel-6.x', {
      presets: ['es2015-loose', 'react', 'stage-3']
    }),
    fis.plugin('translate-es3ify', null, 'append')
  ]
});

fis.match('src/**.vue:jade', {
  parser: [
    fis.plugin('jade', {
      //
    })
  ]
})

fis.match('src/{**.vue:less,**.less}', {
  rExt: 'css',
  parser: [fis.plugin('less-2.x')],
  postprocessor: fis.plugin('autoprefixer')
});

fis.match('src/{**.vue:scss,**.scss}', {
  rExt: 'css',
  parser: [
    fis.plugin('node-sass', {
      sourceMap: true,
      // sourceMapEmbed: true,
    })
  ],
  postprocessor: fis.plugin('autoprefixer'),
});

// 发布
fis.match('/src/(**)', {
  release: '$1'
});

//
fis.match('src/(component/**.css)', {
  // packTo: 'component-all.css',
  release: 'static/$1'
});

// 模块文件
fis.match('/src/**.js', {
  parser: [
    fis.plugin('babel-6.x', {
      presets: ['es2015-loose', 'react', 'stage-3']
    }),
    fis.plugin('translate-es3ify', null, 'append')
  ]
});

// 非模块文件
fis.match('/src/js/engine/**.js', {
  parser: null,
  isMod: false
});

// 页面直接引入的文件，不进行模块require包装
fis.match('/src/js/page/**.js', {
  isMod: false
});

// 打包
fis.match('::package', {
  postpackager: fis.plugin('loader'),
});

// 部署
fis
  .media('local')
  .match('**', {
    deploy: fis.plugin('local-deliver', {
      to: path.join(__dirname, './output/')
    })
  });
