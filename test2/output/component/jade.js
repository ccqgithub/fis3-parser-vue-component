define('src/component/jade.vue', function(require, exports, module) {

  module.exports = {};
  (function (renderFun, staticRenderFns) {
  
    module && module.exports && ((module.exports.render = renderFun) || (module.exports.staticRenderFns = staticRenderFns));
  
    exports && exports["default"] && ((exports["default"].render = renderFun) || (exports["default"].staticRenderFns = staticRenderFns));
  })(function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._c;return _c('div', { staticClass: "component-jade" }, [_vm._v("hello jade !")]);
  }, []);

});
