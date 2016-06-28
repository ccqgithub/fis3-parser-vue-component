define('src/component/c.vue', function(require, exports, module) {

  "use strict";
  
  exports.__esModule = true;
  exports["default"] = {
    created: function created() {
      console.log('component c created !');
    },
  
    methods: {
      //
    }
  };
  
  var _vueTemplateString = "<div class=\"component-c\">\n  Component C\n<img src=\"/image/1.jpg\" alt=\"\">\n</div>";
  
  module && module.exports && (module.exports.template = _vueTemplateString);
  
  exports && exports["default"] && (exports["default"].template = _vueTemplateString);

});
