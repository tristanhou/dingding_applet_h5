import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import http from '@/api/http';
import api from '@/api/api';

Vue.use(ElementUI);
Vue.prototype.$http = http;
Vue.prototype.$api = api;
new Vue({
  el: '#app',
  render: h => h(App)
}); 
