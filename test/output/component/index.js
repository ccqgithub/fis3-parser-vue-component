define('src/component/index.vue', function(require, exports, module) {

  'use strict';
  
  exports.__esModule = true;
  
  var _a = require('src/component/a.vue');
  
  var _a2 = _interopRequireDefault(_a);
  
  var _b = require('src/component/b.vue');
  
  var _b2 = _interopRequireDefault(_b);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
  
  exports["default"] = {
    components: {
      ComponentA: _a2["default"],
      ComponentB: _b2["default"],
      ComponentC: require('src/component/c.vue')["default"]
    },
    created: function created() {
      console.log('Index page created!');
    },
  
    methods: {
      //
    }
  };
  
  var _vueTemplateString = "<div class=\"index\">\n  <p>fis3-parser-vue-component demo runing ~</p>\n  <component-a></component-a>\n  <component-b></component-b>\n  <component-c></component-c>\n</div>";
  
  module && module.exports && (module.exports.template = _vueTemplateString);
  
  exports && exports["default"] && (exports["default"].template = _vueTemplateString);

});
