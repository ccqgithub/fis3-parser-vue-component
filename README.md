# fis3-parser-vue-component

> [FIS3](http://fis.baidu.com/) parser 阶段插件，用于在fis3中编译[Vue](http://vuejs.org.cn/)组件。

## 原理

参考[vue-loader](https://github.com/vuejs/vue-loader)源码，结合fis3的编译特性而编写,下面是parser阶段的主要过程：

1. 解析vue文件，找到其中的`style`,'template','script'标签。

2. 每一个`style`标签创建一个对应的虚拟文件，后缀为`lang`属性指定，默认`css`，你可以指定`less`或其它的后缀。对创建虚拟文件，一样会进行fis3的编译流程（属性`lang`的值决定该文件怎么编译），并加入当前文件的依赖。

3. `template`标签的内容为Vue组件的模板，`template`标签同样有`lang`属性，默认`html`，会进行html特性处理，模板的内容最终会输出到`module.exports.template`中。

4. `script`标签为文件最后输出的内容，支持`lang`属性。

## 组件编写规范

`style`标签可以有多个，`template`和`script`标签只能有一个，具体请参考[vue 单文件组件](http://vuejs.org.cn/guide/application.html)。

## 注意

- 组件中的样式、模板、脚本都会先进行片段处理（片段不产出），对应的配置应该为`fis.match('**.vue:lang', {})`的方式, 由于片段编译只是内容编译，所以不能在片段中配置release等文件才有的特性，具体见下面`安装配置`。
- 每一个style标签会对应产出一个css文件，与vue组件同目录, 可对其重新定义产出路径。
- script标签内容编译后，为组件的最终产出内容。

## 安装配置

安装：`npm install fis3-parser-vue-component --save-dev`。

配置：
```javascript:;
// vue组件本身配置
fis.match('src/vue/**.vue', {
  isMod: true,
  rExt: 'js',
  useSameNameRequire: true,
  parser: fis.plugin('vue-component', {
    cssScopeFlag: 'vuec'
  })
});

// vue组件中产出的css处理。
fis.match('src/(vue/**.css)', {
  release: 'css/$1'
});

// vue组件中的less片段处理
fis.match('src/vue/**.vue:less', {
  rExt: 'css',
  parser: fis.plugin('less'),
  release: 'xxx' // 这个无效
});

// 注意：因为组件中的样式片段编译只是编译内容，所以上面的release配置是无效的。要配置其release，需要针对生成的css文件：
fis.match('src/vue/(**.css)', {
  release: '/vue-style/$1'
});

// vue组件中的sass片段处理
fis.match('src/vue/**.vue:scss', {
  rExt: 'css',
  parser: fis.plugin('node-sass')
});

// vue组件中的jade模板片段处理
fis.match('src/**.vue:jade', {
  rExt: 'css',
  parser: fis.plugin('less')
});

// vue组件中js片段处理。
fis.match('src/**.vue:js', {
  parser: [
    fis.plugin('babel-6.x', {
      presets: ['es2015-loose', 'react', 'stage-3']
    }),
    fis.plugin('translate-es3ify', null, 'append')
  ]
})

// vue组件中的产出coffee片段处理
fis.match('src/**.vue:coffee', {
  rExt: 'html',
  parser: fis.plugin('jade')
})
```

## css scoped支持

> 为了保证每一个组件样式的独立性，是当前组件定义的样式只在当前的组件内生效，引入css scoped机制。

1. 在模板的元素上（一般是根节点）加上scoped标志(class,attr,id)，默认为`__vuec__`， 你可以通过`cssScopedFlag`自定义。可以加在class，或者属性，或者id。
```html
<template>
  <div class="test" __vuec__></div>
  <div class="test __vuec__"></div>
</template>
```
2. 在样式中使用scoped标志。
```css
.test[__vuec__] {
  //
}
// or
.other.__vuec__ {

}
// or
.__vuec__ {
  .a {

  }
}
```
3. scoped标志会根据文件路径生成唯一的hash字符串（如：`_v-23j232jj` ）;

4. 配置：scoped标志默认为'__vuec__'，你可以自定义。
```js
fis.match('src/**.vue', {
  isMod: true,
  rExt: 'js',
  useSameNameRequire: true,
  parser: fis.plugin('vue-component', {
    ccssScopedFlag: '__vuec__', // 组件scoped占位符
    cssScopedIdPrefix: '_v-',   // hash前缀：_v-23j232jj
    cssScopedHashType: 'sum',   // hash生成模式，num：使用`hash-sum`, md5: 使用`fis.util.md5`
    cssScopedHashLength: 8,     // hash 长度，cssScopedHashType为md5时有效
    styleNameJoin: '',          // 样式文件命名连接符 `component-a.css`
    runtimeOnly: true,          // vue@2.x 有润timeOnly模式，为ture时，template会在构建时转为render方法
  })
});
```

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
```
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
```
npm install\
  babel-plugin-syntax-jsx\
  babel-plugin-transform-vue-jsx\
  babel-helper-vue-jsx-merge-props\
  --save-dev
```

fis相关配置
```
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
