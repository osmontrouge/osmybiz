<template>
  <div class="map-wrapper">
    <v-map ref="map" class="map" @l-click="clicked"
           @l-dragend="viewChange" @l-zoomend="viewChange">
      <v-marker v-if="position" :draggable="true" :lat-lng="position" @l-drag="drag"></v-marker>
    </v-map>
  </div>
</template>

<script>
  import Vue2Leaflet from 'vue2-leaflet'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {createMarker} from './../util/markerFactory'
  import {createNoteFromNode} from './../util/overPassNodeUtils'
  import * as L from 'leaflet'
  import {routes} from './../router'
  import {makeTileLayer, getTileUrl} from './../util/mapUtils'
  import {storeViewPort, getInitialPosition} from './../util/positionUtil'

  const zoomOnSelect = 18
  const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

  let map
  let component
  let tileLayer

  function setMapPosition (pos, zoom) {
    map.setView(pos, zoom || zoomOnSelect)
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

  function setTileMode (mode) {
    tileLayer.setUrl(getTileUrl(mode), false)
  }

  function drawBusinesses (businesses) {
    clearMarkers()
    addMarkers(businesses)
  }

  export default {
    mounted () {
      component = this
      map = this.$refs.map.mapObject
      tileLayer = makeTileLayer(this.mode)
      map.addLayer(tileLayer)

      this.$store.subscribe(mut => {
        if (mut.type === 'setMapPosition') {
          setMapPosition(this.position)
          this.viewChange()
        } else if (mut.type === 'setBusinesses') {
          drawBusinesses(this.businesses)
        } else if (mut.type === 'setMode') {
          setTileMode(this.mode)
        }
      })

      map.attributionControl.addAttribution(attribution)
      if (this.position) {
        setMapPosition(this.position)
      } else {
        getInitialPosition(this.$router.currentRoute.params).then(pos => {
          setMapPosition(pos.cords, pos.zoom)
        })
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
        storeViewPort(bbox, zoom, this.$router)
        this.queryOverpass(this.viewPort)
      },
      edit (business) {
        const note = createNoteFromNode(business)
        this.setDetails(note)
        const pos = L.latLng(business.lat, business.lng)
        this.setCoords(pos)
        this.setPosition(pos)
        this.$router.push({name: routes.Detail})
      }
    },
    computed: {
      ...mapGetters([
        'position',
        'mapPosition',
        'viewPort',
        'businesses',
        'mode'
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
