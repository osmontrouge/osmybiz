<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
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
  margin-top: 60px;
}

  button {
    background-color: white;
    position: fixed;
    height:30px;
    width: 200px;
    z-index: 99;
    left: 50%;
    margin-left: -101px;
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
