
<style lang="less">
@import "../less/other.less";
.index[vuec] {
  > p {
    line-height: 50px;
    text-align: center;
    background: rgb(240, 203, 210);
    border: 1px solid #ddd;
  }
}
</style>

<style lang="less">
.style2 {
  width: auto;
}
</style>
<style lang="less">
</style>

<template>
  <div class="index" vuec>
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
