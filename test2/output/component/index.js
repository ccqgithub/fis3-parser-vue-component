define('src/component/index.vue', function(require, exports, module) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _a = require('src/component/a.vue');
  
  var _a2 = _interopRequireDefault(_a);
  
  var _b = require('src/component/b.vue');
  
  var _b2 = _interopRequireDefault(_b);
  
  var _jade = require('src/component/jade.vue');
  
  var _jade2 = _interopRequireDefault(_jade);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
  
  // @require 'src/less/other2.less';
  
  exports["default"] = {
    components: {
      ComponentA: _a2["default"],
      ComponentB: _b2["default"],
      ComponentJade: _jade2["default"],
      ComponentC: require('src/component/c.vue')
    },
    created: function created() {
      console.log('Index page created!');
    },
  
    methods: {
      //
    }
  };
  
  (function (renderFun, staticRenderFns) {
  
    module && module.exports && ((module.exports.render = renderFun) || (module.exports.staticRenderFns = staticRenderFns));
  
    exports && exports["default"] && ((exports["default"].render = renderFun) || (exports["default"].staticRenderFns = staticRenderFns));
  })(function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._c;return _c('div', { staticClass: "index _v-4ddb37f2" }, [_c('p', [_vm._v("fis3-parser-vue-component demo runing ~")]), _vm._v(" "), _c('component-a'), _vm._v(" "), _c('component-b'), _vm._v(" "), _c('component-c'), _vm._v(" "), _c('component-jade')]);
  }, []);

});
