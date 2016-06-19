import Vue from  'vue';

var app = new Vue({
  el: '#app',
  methods: {

  },
  components: {
    App: require('../../component/index')
  },
  created() {
    console.log('created');
  }
});
