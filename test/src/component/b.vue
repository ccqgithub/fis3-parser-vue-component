
<style lang="less">
.component-b {
  line-height: 50px;
  text-align: center;
  color: #fff;
  background: rgb(114, 61, 227);

  a {
    display: block;
    border: 1px solid #ddd;
  }
}
</style>

<template>
  <div class="component-b">
    Component B <a href="javascript:;" @click="hello">Click Me</a>
  </div>
</template>

<script>
  module.exports = {
    created() {
      console.log('component b created !');
    },
    methods: {
      hello() {
        alert('hello!');
      }
    }
  }
</script>
