
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
  </div>
</template>

<script>
  import ComponentA from './a';
  import ComponentB from './b';
  import ComponentJade from './jade';

  // @require '../less/other2.less';

  export default {
    components: {
      ComponentA,
      ComponentB,
      ComponentJade,
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
