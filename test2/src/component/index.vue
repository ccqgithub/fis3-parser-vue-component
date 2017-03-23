
<style lang="less" scoped>
@import "../less/other.less";
.index {
  > p {
    line-height: 50px;
    text-align: center;
    background: rgb(240, 203, 210);
    border: 1px solid #ddd;
  }
}
.__vuec__ {
  color: red;
}
</style>

<style lang="scss">
@import "../scss/test.scss";
$blue : #1875e7;　
.style2 {
  width: auto;
  color: $blue;
}
</style>
<style lang="less">
</style>

<template>
  <div class="index" >
    <p>fis3-parser-vue-component demo runing ~</p>
    <component-a></component-a>
    <component-b></component-b>
    <component-c></component-c>
    <component-jade></component-jade>
    <test-bug></test-bug>
    <div class="__vuec__">
      cssScopedFlag test, color red !
    </div>
  </div>
</template>

<script>
  import ComponentA from './a';
  import ComponentB from './b';
  import ComponentJade from './jade';
  import TestBug from './test-bug';

  // @require '../less/other2.less';

  export default {
    components: {
      ComponentA,
      ComponentB,
      ComponentJade,
      TestBug,
      ComponentC: require('./c').default
    },
    created() {
      console.log('Index page created!');
    },
    methods: {
      //
    }
  }
</script>
