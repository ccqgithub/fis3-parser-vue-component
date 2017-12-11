# fis3-parser-vue-component

> 由于本插件作者开始使用webpack，本插件不再积极维护，建议使用fis的同学fork一份发布一个新插件。

> 如果你已经在积极维护一个新的插件并且希望使用此插件的人转过去，请提一个issue，我在这里加上一个提示。

## 相关

[vue + vuex + vue-router + webpack 快速开始脚手架](https://github.com/ccqgithub/vue-start).

## 注意

- `5.5.0` for `vue@2.5.x`。

- 版本： `>=4.10.0 <5.0.0`对应`vue@1.x`, 版本`>= 5.1.0`对应`vue@2.x`。

- css依赖：css的依赖应该写在js中(如：`require('xxx.css')`), js中依赖的css优先于`style`标签。

- FIS3 构建过程分为`单文件编译`和`打包过程`，`fis.match('component/**.vue:js')`这种配置属于片段编译，对应于单文件编译阶段，配置release等属性无效。打包过程的属性和插件应该针对`fis.match('component/**.vue')`和`fis.match('component/**.css')`配置。（具体见后面使用方法）

## 使用方法

- 安装

```
npm install fis3-parser-vue-component --save-dev
```

- 基础配置

```js
fis.match('src/**.vue', {
  isMod: true,
  rExt: 'js',
  useSameNameRequire: true,
  parser: [
    fis.plugin('vue-component', {
      // vue@2.x runtimeOnly
      runtimeOnly: true,          // vue@2.x 有runtimeOnly模式，为true时，template会在构建时转为render方法

      // styleNameJoin
      styleNameJoin: '',          // 样式文件命名连接符 `component-xx-a.css`

      extractCSS: true,           // 是否将css生成新的文件, 如果为false, 则会内联到js中

      // css scoped
      cssScopedIdPrefix: '_v-',   // hash前缀：_v-23j232jj
      cssScopedHashType: 'sum',   // hash生成模式，num：使用`hash-sum`, md5: 使用`fis.util.md5`
      cssScopedHashLength: 8,     // hash 长度，cssScopedHashType为md5时有效

      cssScopedFlag: '__vuec__',  // 兼容旧的ccs scoped模式而存在，此例子会将组件中所有的`__vuec__`替换为 `scoped id`，不需要设为空
    })
  ],
});
```

- ES2015, coffee 等

```js
// vue组件中ES2015处理
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

// vue组件中coffee片段处理。
fis.match('src/**.vue:coffee', {
  parser: [
    fis.plugin('cooffe')
  ]
})
```

- LESS, SASS 等

```js
fis.match('src/**.vue:less', {
  rExt: 'css',
  parser: [fis.plugin('less-2.x')],
  postprocessor: fis.plugin('autoprefixer')
});

fis.match('src/{**.vue:scss}', {
  rExt: 'css',
  parser: [
    fis.plugin('node-sass', {
      sourceMap: true
    })
  ],
  postprocessor: fis.plugin('autoprefixer'),
});
```

- Jade 等

```js
fis.match('src/**.vue:jade', {
  parser: [
    fis.plugin('jade', {
      //
    })
  ]
})
```

- 产出，打包

```js
fis.match('src/(**).vue', {
  release: 'static/vue/$1.js'
});

fis.match('src/(component/**.css)', {
  packTo: 'component-all.css',
  release: 'static/$1'
});
```

## 原理

参考[vue-loader](https://github.com/vuejs/vue-loader)源码，结合fis3的编译特性而编写,下面是parser阶段的主要过程：

1. 解析vue文件，找到其中的`style`,`template`,`script`标签。

2. 每一个`style`标签创建一个对应的虚拟文件，后缀为`lang`属性指定，默认`css`，你可以指定`less`或其它的后缀。对创建虚拟文件，一样会进行fis3的编译流程（属性`lang`的值决定该文件怎么编译），并加入当前文件的依赖。

3. `template`标签的内容为Vue组件的模板，`template`标签同样有`lang`属性，默认`html`，会进行html特性处理，模板的内容最终会输出到`module.exports.template`中。

4. `script`标签为文件最后输出的内容(加入模板字符串)，支持`lang`属性。

## 组件编写规范

`style`标签可以有多个，`template`和`script`标签只能有一个，具体请参考[vue 单文件组件](https://vuejs.org/v2/guide/single-file-components.html)。

## css scoped支持

> 为了保证每一个组件样式的独立性，是当前组件定义的样式只在当前的组件内生效，引入css scoped机制。

- 在style标签中使用scoped标志。

    ```css
    <style scoped></style>
    <style lang="scss" scoped></style>
    ```

- scoped标志会根据文件路径生成唯一的hash字符串（如：`_v-23j232jj` ）

## 测试demo

> test 对应vue1， test2对应vue2

`npm install`

`cd test`, 编写代码…

`npm install`

`fis3 release`

`fis3 server start`

## Vue2 JSX支持：

> 使用vue 官方 babel插件[babel-plugin-transform-vue-jsx](https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage).

vue文件：
```html
<script lang="jsx">
export default {
  render (h) {
    return (
      <div
        // normal attributes or component props.
        id="foo"
        // DOM properties are prefixed with domProps-
        domProps-innerHTML="bar"
        // event listeners are prefixed with on- or nativeOn-
        on-click={this.clickHandler}
        nativeOn-click={this.nativeClickHandler}
        // other special top-level properties
        class={{ foo: true, bar: false }}
        style={{ color: 'red', fontSize: '14px' }}
        key="key"
        ref="ref"
        slot="slot">
      </div>
    )
  }
}
</script>
```

安装babel插件：
```shell
npm install\
  babel-plugin-syntax-jsx\
  babel-plugin-transform-vue-jsx\
  babel-helper-vue-jsx-merge-props\
  --save-dev
```

fis相关配置
```js
// vue组件中jsx片段处理。
fis.match('src/**.vue:jsx', {
  parser: [
    fis.plugin('babel-6.x', {
      presets: ['es2015-loose', 'stage-3'],
      plugins: ["transform-vue-jsx"]
    }),
    //fis.plugin('translate-es3ify', null, 'append')
  ]
})
```
