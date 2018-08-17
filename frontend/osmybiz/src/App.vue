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
      this.$translate.setLang('de');
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
