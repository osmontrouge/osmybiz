// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {sync} from 'vuex-router-sync'
import store from './store'
import TileMap from './components/TileMap'
import * as L from 'leaflet'

sync(store, router)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App, TileMap }
})

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('./../node_modules/leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('./../node_modules/leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('./../node_modules/leaflet/dist/images/marker-shadow.png')
})
