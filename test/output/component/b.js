define('src/component/b.vue', function(require, exports, module) {

  'use strict';
  
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
  var _vueTemplateString = "<div class=\"component-b\">\n  Component B <a href=\"javascript:;\" @click=\"hello\">Click Me</a>\n</div>";
  
  module && module.exports && (module.exports.template = _vueTemplateString);
  
  exports && exports["default"] && (exports["default"].template = _vueTemplateString);

});
