define('src/component/c.vue', function(require, exports, module) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = {
    created: function created() {
      console.log('component c created !');
    },
  
    methods: {
      //
    }
  };
  
  (function (renderFun, staticRenderFns) {
  
    module && module.exports && ((module.exports.render = renderFun) || (module.exports.staticRenderFns = staticRenderFns));
  
    exports && exports["default"] && ((exports["default"].render = renderFun) || (exports["default"].staticRenderFns = staticRenderFns));
  })(function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._c;return _c('div', { staticClass: "component-c" }, [_vm._v("\n  Component C\n\n")]);
  }, []);

});
