<template>
  <div id="app">
    <header-bar></header-bar>

    <router-view></router-view>

    <post-success></post-success>

    <error-message></error-message>
  </div>
</template>

<script>
  import HeaderBar from './components/shared/HeaderBar.vue';
  import ErrorMessage from './components/shared/ErrorMessage.vue';
  import PostSuccess from './components/landing/PostSuccess.vue';

  export default {
    name: 'app',
    mounted() {
      if (this.$translate.$cookies.get('lang')) {
        // get language from cookies
        this.$translate.setLang(this.$translate.$cookies.get('lang'));
        document.getElementById('translation-select').value = this.$translate.$cookies.get('lang');
      } else {
        // get language from browser
        const browserLanguageSettings = window.navigator.userLanguage || window.navigator.language;
        const firstTwoLetters = browserLanguageSettings.slice(0, 2).toLowerCase();
        const supportedLanguage = ['de', 'en', 'fr', 'he', 'hu', 'it', 'pl', 'ru', 'sv', 'zh'];

        if (supportedLanguage.includes(firstTwoLetters)) {
          if (firstTwoLetters === 'zh') {
            this.$translate.setLang('zhTW');
            document.getElementById('translation-select').value = 'zhTW';
          } else {
            this.$translate.setLang(firstTwoLetters);
            document.getElementById('translation-select').value = firstTwoLetters;
          }
        } else {
          // only if  browser language is not supported
          this.$translate.setLang('de');
          document.getElementById('translation-select').value = 'de';
        }
      }
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
