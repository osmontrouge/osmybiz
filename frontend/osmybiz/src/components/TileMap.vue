<template>
  <div class="map-wrapper">
    <v-map ref="map" class="map" :zoom="initialZoom" :center="initialPos" @l-click="clicked" :attribution="attribution">
      <v-tilelayer :url="tileUrl"></v-tilelayer>
      <v-marker v-if="position" :draggable="true" :lat-lng="position" @l-drag="drag"></v-marker>
    </v-map>
  </div>
</template>

<script>
  import Vue2Leaflet from 'vue2-leaflet'
  import {mapGetters, mapMutations} from 'vuex'

  const zoomOnSelect = 18

  let map
  function setMapPosition (pos) {
    map.setView(pos, zoomOnSelect)
  }

  export default {
    mounted () {
      map = this.$refs.map.mapObject
      this.$store.subscribe(mut => {
        if (mut.type === 'setMapPosition') {
          setMapPosition(this.position)
        }
      })

      map.attributionControl.addAttribution(this.attribution)
      if (this.position) {
        setMapPosition(this.position)
      }
    },
    methods: {
      ...mapMutations([
        'setPosition'
      ]),
      clicked (event) {
        this.setPosition(event.latlng)
      },
      drag (event) {
        this.setPosition(event.latlng)
      }
    },
    computed: {
      ...mapGetters([
        'initialPos',
        'initialZoom',
        'attribution',
        'tileUrl',
        'position',
        'mapPosition'
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
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .map {
    height: 100%;
    width: 100%;
  }
</style>
