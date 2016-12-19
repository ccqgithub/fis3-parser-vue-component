define('src/component/a.vue', function(require, exports, module) {

  module.exports = {
    created: function created() {
      console.log('component a created !');
    },
  
    methods: {
      //
    }
  };
  (function (renderFun, staticRenderFns) {
  
    module && module.exports && ((module.exports.render = renderFun) || (module.exports.staticRenderFns = staticRenderFns));
  
    exports && exports["default"] && ((exports["default"].render = renderFun) || (exports["default"].staticRenderFns = staticRenderFns));
  })(function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._c;return _c('div', { staticClass: "component-a", attrs: { "_v-16c48809": "" } }, [_vm._v("\n  Component A\n")]);
  }, []);

});
