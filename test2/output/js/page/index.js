'use strict';

var _vue = require('node_modules/vue/dist/vue.runtime.common');

var _vue2 = _interopRequireDefault(_vue);

var _index = require('src/component/index.vue');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = new (_vue2["default"].extend(_index2["default"]))().$mount();
document.getElementById('app').appendChild(app.$el);

/**
 * @require 'src/less/index.less'
 */