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
  module && module.exports && (module.exports.template = "<div class=\"component-a\">\n  Component A\n</div>");
  
  exports && exports["default"] && (exports["default"].template = "<div class=\"component-a\">\n  Component A\n</div>");

});
