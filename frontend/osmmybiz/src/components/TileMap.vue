<template>
  <div class="map-wrapper">
    <v-map class="map" :zoom="initialZoom" :center="initialPos">
      <v-tilelayer :url="tileUrl" :attribution="attribution"></v-tilelayer>
    </v-map>
  </div>
</template>

<script>
  import Vue2Leaflet from 'vue2-leaflet'
  import {mapGetters} from 'vuex'

  export default {
    created () {
      console.log(this)
      this.$store.subscribe((mut, state) => {
        console.log('state changed', state, mut)
      })
    },
    computed: {
      ...mapGetters([
        'initialPos',
        'initialZoom',
        'attribution',
        'tileUrl'
      ])
    },

    name: 'tile-map',
    components: {
      'v-map': Vue2Leaflet.Map,
      'v-tilelayer': Vue2Leaflet.TileLayer,
      'v-marker': Vue2Leaflet.Marker
    }
  }
</script>

<style>

  .map-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0
  }
  .map {
    height: 100%;
    width: 100%;
  }
</style>
