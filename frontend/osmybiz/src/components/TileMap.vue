<template>
  <div class="map-wrapper">
    <v-map ref="map" class="map" @l-dragend="viewChange" @l-zoomend="viewChange" @l-contextmenu="contextMenu($event)">
    </v-map>
  </div>
</template>

<script>
  import Vue2Leaflet from 'vue2-leaflet'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {createNoteFromNode} from './../util/overPassNodeUtils'
  import * as L from 'leaflet'
  import {routes} from './../router'
  import {makeTileLayer, getTileUrl, createNewBusinessPopup, createMarker} from './../util/mapUtils'
  import {storeViewPort, getInitialPosition} from './../util/positionUtil'
  import {setError} from '../store/error'
  import * as _ from 'lodash'

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

  function addMarkers (bs, isloggedIn, checkDuplicate, setIsNote, ownedNodes, viewport) {
    const mine = getNodesInViewPort(ownedNodes, viewport)
    const merge = mergeNodes(bs, mine)
    const ms = merge.map(b => {
      const m = createMarker(b, map, isloggedIn, (data) => {
        checkDuplicate(data).then((res) => {
          if (!res) {
            component.edit(data)
          }
        })
      }, setIsNote)
      map.addLayer(m)
      return m
    })

    markers = ms
  }

  function mergeNodes (all, mine) {
    return _.unionBy(mine, all, (b) => b.id)
  }

  function getNodesInViewPort (nodes, viewPort) {
    const bbox = viewPort.boundingBox
    return nodes.filter(n => {
      return n.lat >= bbox.south && n.lat <= bbox.north && n.lng >= bbox.west && n.lng <= bbox.east
    })
  }

  function setTileMode (mode) {
    tileLayer.setUrl(getTileUrl(mode), false)
  }

  function drawBusinesses (businesses, isloggedIn, checkDuplicate, setIsNote, ownedNodes, viewport) {
    clearMarkers()
    addMarkers(businesses, isloggedIn, checkDuplicate, setIsNote, ownedNodes, viewport)
  }

  function drawContextMenu (coords, isloggedIn, setIsNote) {
    createNewBusinessPopup(map, coords, isloggedIn, (latlng) => {
      setIsNote(false)
      component.createNew(latlng)
    })
  }

  export default {
    mounted () {
      component = this
      map = this.$refs.map.mapObject
      tileLayer = makeTileLayer(this.mode)
      map.addLayer(tileLayer)

      tileLayer.on('tileerror', function () {
        setError('Karte konnte nicht geladen werden')
      })

      this.$store.subscribe(mut => {
        if (mut.type === 'setMapPosition') {
          setMapPosition(this.position)
          this.viewChange()
        } else if (mut.type === 'setBusinesses') {
          drawBusinesses(this.businesses, this.isLoggedIn, this.checkDuplicateNote, this.setIsNote, this.ownedNodes, this.viewPort)
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
      ...mapActions(['queryOverpass', 'checkDuplicateNote']),
      ...mapMutations([
        'setViewPort',
        'setDetails',
        'setCoords',
        'setIsNote',
        'setPosition',
        'setOsmId'
      ]),
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
        this.setOsmId(business.id)
        this.setIsNote(true)
        this.$router.push({name: routes.Detail})
      },
      contextMenu (event) {
        drawContextMenu(event.latlng, this.isLoggedIn, this.setIsNote)
      },
      createNew (coords) {
        this.setCoords(coords)
        this.setIsNote(false)
        this.setDetails({
          category: {
            text: '',
            value: 0,
            fields: [
              {key: '', name: '', value: ''}
            ]
          },
          name: '',
          opening_hours: '',
          phone: '',
          email: '',
          website: '',
          wheelchair: '',
          description: '',
          note: ''
        })
        this.$router.push({name: routes.Detail})
      }
    },
    computed: {
      ...mapGetters([
        'mapPosition',
        'position',
        'viewPort',
        'businesses',
        'mode',
        'isLoggedIn',
        'ownedNodes'
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

  .popup-link {
    cursor: pointer;
    text-decoration: underline;
  }
</style>
