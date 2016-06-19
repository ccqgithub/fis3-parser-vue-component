# fis3-parser-vue-component

> [FIS3](http://fis.baidu.com/) parser 阶段插件，用于在fis3中编译[Vue](http://vuejs.org.cn/)组件。

## 原理

参考[vue-loader](https://github.com/vuejs/vue-loader)源码，结合fis3的编译特性而编写,下面是parser阶段的主要过程：

1. 解析vue文件，找到其中的`style`,'template','script'标签。

2. 每一个`style`标签创建一个对应的虚拟文件，后缀为`lang`属性指定，默认`css`，你可以指定`less`或其它的后缀。对创建虚拟文件，一样会进行fis3的编译流程（属性`lang`的值决定该文件怎么编译），并加入当前文件的依赖。

3. `template`标签的内容为Vue组件的模板，`template`标签同样有`lang`属性，默认`html`，会进行html特性处理，模板的内容最终会输出到`module.exports.template`中。

4. `script`标签为文件最后输出的内容，这里不再提供`lang`属性，如果是coffe等非js文件，请在`fis-conf.js`中配置。

# 组件编写规范

`style`标签可以有多个，`template`和`script`标签只能有一个，具体请参考[vue 单文件组件](http://vuejs.org.cn/guide/application.html)。

## 安装配置

安装：`npm install fis3-parser-vue-component --save-dev`。

配置：
```javascript:;
// vue
fis.match('src/**.vue', {
  isMod: true,
  rExt: 'js',
  useSameNameRequire: true,
  parser: [
    fis.plugin('vue-component', {
        // 暂时还没有自定义配置哦
    }),
    fis.plugin('babel-6.x', {
      presets: ['es2015-loose', 'react', 'stage-3']
    }),
    fis.plugin('translate-es3ify', null, 'append')
  ]
});
```
