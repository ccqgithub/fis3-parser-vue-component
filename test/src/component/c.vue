
<style lang="less">
.component-c {
  line-height: 50px;
  text-align: center;
  color: #fff;
  background: rgb(37, 144, 19);
  img {
    display: block;
    width: 100%;
  }
}
</style>

<template>
  <div class="component-c">
    Component C
  <img src="../image/1.jpg" alt="" />
  </div>
</template>

<script>
  export default {
    created() {
      console.log('component c created !');
    },
    methods: {
      //
    }
  }
</script>
