
<style lang="less">
.index {
  > p {
    line-height: 50px;
    text-align: center;
    background: rgb(240, 203, 210);
    border: 1px solid #ddd;
  }
}
</style>

<template>
  <div class="index">
    <p>fis3-parser-vue-component demo runing ~</p>
    <component-a></component-a>
    <component-b></component-b>
    <component-c></component-c>
  </div>
</template>

<script>
  import ComponentA from './a';
  import ComponentB from './b';

  export default {
    components: {
      ComponentA,
      ComponentB,
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
