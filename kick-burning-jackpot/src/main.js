import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import Vuelidate from 'vuelidate';
import Bia from '@/api/bia';

Vue.config.productionTip = false;

Vue.prototype.$bia = new Bia();

new Vue({
  Vuelidate,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
