define('src/component/a.vue', function(require, exports, module) {

  "use strict";
  
  module.exports = {
    created: function created() {
      console.log('component a created !');
    },
  
    methods: {
      //
    }
  };
  var _vueTemplateString = "<div class=\"component-a\">\n  Component A\n</div>";
  
  module && module.exports && (module.exports.template = _vueTemplateString);
  
  exports && exports["default"] && (exports["default"].template = _vueTemplateString);

});
