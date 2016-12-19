import Vue from  'vue';

import Index from '../../component/index';

var app = new (Vue.extend(Index))().$mount();
document.getElementById('app').appendChild(app.$el)


/**
 * @require '../../less/index.less'
 */
