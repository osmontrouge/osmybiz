import * as L from 'leaflet';
import Vue from 'vue';
import VueTranslate from 'vue-translate-plugin';
import { sync } from 'vuex-router-sync';
import store from './store';
import App from './App.vue';
import router from './router';
import de from './locales/de.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import he from './locales/he.json';
import hu from './locales/hu.json';
import it from './locales/it.json';
import pl from './locales/pl.json';
import ru from './locales/ru.json';
import sv from './locales/sv.json';
import zhTW from './locales/zh_TW.json';

Vue.use(VueTranslate);
Vue.locales({
  de,
  en,
  fr,
  he,
  hu,
  it,
  pl,
  ru,
  sv,
  zhTW,
});

sync(store, router);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created() {
    this.$translate.setLang('de');
  },
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
