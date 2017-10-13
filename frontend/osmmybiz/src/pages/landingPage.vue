<template>

  <tile-map></tile-map>
</template>

<script>
  import TileMap from './../components/TileMap'

  export default {

    components: {TileMap},
    mounted () {
      console.log(this)
    }
  }

</script>

<style>

</style>
