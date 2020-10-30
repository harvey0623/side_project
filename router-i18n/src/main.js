import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from '@/plugins/i18n/index.js';
import translate from '@/plugins/i18n/translation.js';

Vue.prototype.$i18nRoute = translate.i18nRoute.bind(translate);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
