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

  button {
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #7ebc6f;
  }

  button:hover {
    background-color: #7ebc6f;
    color: white;
  }

</style>
