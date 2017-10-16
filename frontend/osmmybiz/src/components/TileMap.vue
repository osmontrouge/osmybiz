<template>
  <div class="map-wrapper">
    <v-map ref="map" class="map" :zoom="initialZoom" :center="initialPos">
      <v-tilelayer :url="tileUrl" :attribution="attribution"></v-tilelayer>
      <v-marker v-if="position" :lat-lng="position"></v-marker>
    </v-map>
  </div>
</template>

<script>
  import Vue2Leaflet from 'vue2-leaflet'
  import {mapGetters} from 'vuex'

  let map
  function setMapPosition (pos) {
    map.setView(pos, 20)
  }

  export default {
    mounted () {
      map = this.$refs.map.mapObject
      this.$store.subscribe((mut, state) => {
        if (mut.type === 'setPosition') {
          console.log('state changed', state, mut)
          setMapPosition(this.position)
        }
      })
    },
    computed: {
      ...mapGetters([
        'initialPos',
        'initialZoom',
        'attribution',
        'tileUrl',
        'position'
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
