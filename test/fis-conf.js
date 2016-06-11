var path = require('path');
var parserVuePlugin = require('../index');

// 需要构建的文件
fis.set('project.fileType.text', 'vue');
fis.set('project.files', ['src/**']);
fis.set('project.ignore', fis.get('project.ignore').concat(['output/**', 'DS_store']));

// vue
fis.match('src/**.vue', {
  rExt: 'js',
  useSameNameRequire: true,
  parser: [parserVuePlugin]
});

fis.match('**', {
  release: '$&'
});

fis.match('::package', {
  postpackager: fis.plugin('loader'),
});

fis
  .media('local')
  .match('**', {
    deploy: fis.plugin('local-deliver', {
      to: path.join(__dirname, './output/')
    })
  });
