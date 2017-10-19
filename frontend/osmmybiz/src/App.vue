<template>
  <div id="app">
    <header-bar></header-bar>
    <router-view></router-view>
  </div>
</template>

<script>
  import HeaderBar from './components/HeaderBar'

  export default {
    name: 'app',
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
</style>
