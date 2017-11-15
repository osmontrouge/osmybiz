<template>
  <div class="map-wrapper">
    <v-map ref="map" class="map" :zoom="initialZoom" :center="initialPos" @l-click="clicked"
           @l-dragend="viewChange" @l-zoomend="viewChange">
      <v-tilelayer :url="tileUrl"></v-tilelayer>
      <v-marker v-if="position" :draggable="true" :lat-lng="position" @l-drag="drag"></v-marker>
    </v-map>
  </div>
</template>

<script>
  import Vue2Leaflet from 'vue2-leaflet'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {createMarker} from './../util/markerFactory'
  import {createNoteFromNode} from './../util/overPassNodeUtils'
  import {latLng} from 'leaflet'
  import {routes} from './../router'

  const zoomOnSelect = 18

  let map
  let component

  function setMapPosition (pos) {
    map.setView(pos, zoomOnSelect)
  }

  let markers = []

  function clearMarkers () {
    markers.forEach(m => {
      map.removeLayer(m)
    })
  }

  function addMarkers (bs) {
    const ms = bs.map(b => {
      const m = createMarker(b, (data) => component.edit(data))
      map.addLayer(m)
      return m
    })

    markers = ms
  }

  function drawBusinesses (businesses) {
    clearMarkers()
    addMarkers(businesses)
  }

  export default {
    mounted () {
      component = this
      map = this.$refs.map.mapObject
      this.$store.subscribe(mut => {
        if (mut.type === 'setMapPosition') {
          setMapPosition(this.position)
          this.viewChange()
        } else if (mut.type === 'setBusinesses') {
          drawBusinesses(this.businesses)
        }
      })

      map.attributionControl.addAttribution(this.attribution)
      if (this.position) {
        setMapPosition(this.position)
      }
    },
    methods: {
      ...mapActions(['queryOverpass']),
      ...mapMutations([
        'setPosition',
        'setViewPort',
        'setDetails',
        'setCoords'
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
        this.queryOverpass(this.viewPort)
      },
      edit (business) {
        const note = createNoteFromNode(business)
        this.setDetails(note)
        const pos = latLng(business.lat, business.lng)
        this.setCoords(pos)
        this.setPosition(pos)
        this.$router.push({name: routes.Detail})
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
        'viewPort',
        'businesses'
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

  .map-popup {
    display: flex;
    flex-direction:column;
    font-size: 16px
  }

  .popup-title {
    font-weight: bold;
  }
</style>
