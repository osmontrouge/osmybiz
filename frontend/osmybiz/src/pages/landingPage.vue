<template>
  <div>
    <search-bar></search-bar>
    <tile-map></tile-map>
    <selected-position></selected-position>
    <toggle-button></toggle-button>
  </div>
</template>

<script>
  import TileMap from './../components/TileMap'
  import SearchBar from './../components/SearchBar'
  import SelectedPosition from './../components/SelectedPosition'
  import ToggleButton from './../components/ToggleButton'

  export default {
    components: {
      SearchBar,
      TileMap,
      SelectedPosition,
      ToggleButton
    }
  }

</script>

<style>

</style>
