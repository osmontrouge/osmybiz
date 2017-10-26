<template>
  <div class="map-wrapper">
    <v-map ref="map" class="map" :zoom="initialZoom" :center="initialPos" @l-dragend="viewChange"
           @l-zoomend="viewChange" @l-click="clicked">
      <v-tilelayer :url="tileUrl" :attribution="attribution"></v-tilelayer>
      <v-marker v-if="position" :draggable="true" :lat-lng="position" @l-drag="drag"></v-marker>
    </v-map>
  </div>
</template>

<script>
  import Vue2Leaflet from 'vue2-leaflet'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import * as L from 'leaflet'

  const zoomOnSelect = 18

  let map

  const bizMarker = L.icon({
    iconUrl: '../static/biz-marker.png',
    iconSize: [64, 64]
  })

  function setMapPosition (pos) {
    map.setView(pos, zoomOnSelect)
  }

  export default {
    mounted () {
      map = this.$refs.map.mapObject
      this.$store.subscribe(mut => {
        if (mut.type === 'setMapPosition') {
          setMapPosition(this.position)
          this.viewChange()
        }
      })

      const testmarker = L.marker(this.initialPos, {
        icon: bizMarker
      })

      testmarker.on('click', evt => {
        console.log(evt)
      })
      testmarker.addTo(map)
    },
    methods: {
      ...mapActions(['queryOverpass']),
      ...mapMutations([
        'setPosition',
        'setViewPort'
      ]),
      clicked (event) {
        this.setPosition(event.latlng)
      },
      drag (event) {
        this.setPosition(event.latlng)
      },
      viewChange () {
        const bbox = map.getBounds()
        const zoom = map.getZoom()
        this.setViewPort({
          topRight: bbox._northEast,
          bottomLeft: bbox._southWest,
          zoom: zoom
        })
        if (zoom >= zoomOnSelect) {
          this.queryOverpass(this.viewPort.boundingBox)
        }
      }
    },
    computed: {
      ...mapGetters([
        'initialPos',
        'initialZoom',
        'attribution',
        'tileUrl',
        'position',
        'mapPosition',
        'viewPort'
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
