import * as L from 'leaflet';
import Vue from 'vue';
import VueCookies from 'vue-cookies';
import VueI18n from 'vue-i18n';
import { sync } from 'vuex-router-sync';
import store from './store';
import App from './App.vue';
import router from './router';
import de from './locales/de.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import gl from './locales/gl.json'; //no tags yet TODO
import he from './locales/he.json';
import hu from './locales/hu.json';
import it from './locales/it.json';
import pl from './locales/pl.json';
import ru from './locales/ru.json';
import sv from './locales/sv.json';
import uk from './locales/uk.json'; //no tags yet TODO
/* eslint-disable-next-line camelcase */
import zh_TW from './locales/zh_TW.json';
import { FALLBACKLOCALE } from './store/locale';

Vue.use(VueCookies);
Vue.use(VueI18n);

const messages = ({
  de,
  en,
  fr,
  gl,
  he,
  hu,
  it,
  pl,
  ru,
  sv,
  uk,
  zh_TW,
});

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: FALLBACKLOCALE,
  messages,
});

sync(store, router);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
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
