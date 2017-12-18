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

  /*
  const test = [ {text: 'Banane'}, {text: 'Apfel'}, {text: 'Zopf'} ];
  test.sort((a, b) => a.text > b.text);
  console.log(test);
  */

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
    border-radius: 5px;
  }

  button:hover {
    background-color: #55834a;
    color: white;
  }

  button:disabled {
    background-color: grey;
    color: white;
    cursor: default;
    border: none;
  }

</style>
