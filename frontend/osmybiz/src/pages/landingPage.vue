<template>
  <div>
    <search-bar></search-bar>
    <tile-map></tile-map>
    <selected-position></selected-position>
  </div>
</template>

<script>
  import TileMap from './../components/TileMap'
  import SearchBar from './../components/SearchBar'
  import SelectedPosition from './../components/SelectedPosition'

  export default {

    components: {
      SearchBar,
      TileMap,
      SelectedPosition
    }
  }

</script>

<style>

</style>
