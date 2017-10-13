<template>
  <div>
    <search-bar></search-bar>
    <tile-map></tile-map>
  </div>

</template>

<script>
  import TileMap from './../components/TileMap'
  import SearchBar from './../components/SearchBar.vue'

  export default {

    components: {
      SearchBar,
      TileMap},
    mounted () {
      console.log(this)
    }
  }

</script>

<style>

</style>
