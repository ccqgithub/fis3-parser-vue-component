<template>
  <div class="component-a">
    Component A
  </div>
</template>

<script>
  module.exports = {
    created() {
      console.log('component a created !');
    },
    methods: {
      //
    }
  }
</script>

<style lang="less" scoped>
body {
  a {
    color: inherit;
  }
}
.component-a {
  line-height: 50px;
  text-align: center;
  color: #fff;
  background: rgb(227, 99, 61);
}
</style>
