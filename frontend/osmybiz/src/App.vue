<template>
  <div id="app">
    <header-bar></header-bar>

    <router-view></router-view>

    <post-success></post-success>

    <error-message></error-message>
  </div>
</template>

<script>
  import Vue from 'vue';
  import VueTranslate from 'vue-translate-plugin';
  import HeaderBar from './components/HeaderBar.vue';
  import ErrorMessage from './components/ErrorMessage.vue';
  import PostSuccess from './components/PostSuccess.vue';
  import de from './locales/de.json';
  import en from './locales/en.json';
  import { init } from './util/translate';

  Vue.use(VueTranslate);
  Vue.locales({
    de,
    en,
  });

  export default {
    name: 'app',
    mounted() {
      this.$translate.setLang('de');
      init(this.$translate);
    },
    components: {
      HeaderBar,
      ErrorMessage,
      PostSuccess,
    },
  };
</script>

<style>

  @import "./../node_modules/leaflet/dist/leaflet.css";

  @import "scss/globals.scss";

</style>
