import Vue from 'vue';
import * as L from 'leaflet';
import { sync } from 'vuex-router-sync';
import App from './App.vue';
import router from './router';
import store from './store';

sync(store, router);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});

// eslint-disable-next-line no-underscore-dangle
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
// eslint-disable-next-line global-require
  iconRetinaUrl: require('./../node_modules/leaflet/dist/images/marker-icon-2x.png'),
// eslint-disable-next-line global-require
  iconUrl: require('./../node_modules/leaflet/dist/images/marker-icon.png'),
// eslint-disable-next-line global-require
  shadowUrl: require('./../node_modules/leaflet/dist/images/marker-shadow.png'),
});
