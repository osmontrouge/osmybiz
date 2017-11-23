<template>
  <div id="app">
    <header-bar></header-bar>
    <router-view></router-view>
  </div>
</template>

<script>
  import HeaderBar from './components/HeaderBar'
  import Vue from 'vue'
  import VueTranslate from 'vue-translate-plugin'
  import de from './locales/de.json'
  import en from './locales/en.json'

  Vue.use(VueTranslate)
  Vue.locales({
    de: de,
    en: en
  })

  export default {
    name: 'app',
    mounted () {
      this.$translate.setLang('de')
    },
    components: {
      HeaderBar
    }
  }
</script>

<style>

  @import "./../node_modules/leaflet/dist/leaflet.css";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

  button {
    background-color: #7ebc6f;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #55834a;
    padding: 6px 12px;
  }

  button:hover {
    background-color: #55834a;
    color: white;
  }

</style>
