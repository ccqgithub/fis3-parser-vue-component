define('src/component/b.vue', function(require, exports, module) {

  module.exports = {
    created: function created() {
      console.log('component b created !');
    },
  
    methods: {
      hello: function hello() {
        alert('hello!');
      }
    }
  };
  (function (renderFun, staticRenderFns) {
  
    module && module.exports && ((module.exports.render = renderFun) || (module.exports.staticRenderFns = staticRenderFns));
  
    exports && exports["default"] && ((exports["default"].render = renderFun) || (exports["default"].staticRenderFns = staticRenderFns));
  })(function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._c;return _c('div', { staticClass: "component-b" }, [_vm._v("\n  Component B "), _c('a', { attrs: { "href": "javascript:;" }, on: { "click": _vm.hello } }, [_vm._v("Click Me")])]);
  }, []);

});
