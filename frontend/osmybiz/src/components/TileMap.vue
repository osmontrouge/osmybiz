<template>
  <div class="map-wrapper">
    <v-map ref="map" class="map" @l-dragend="viewChange" @l-zoomend="viewChange" @l-contextmenu="contextMenu($event)">
    </v-map>
  </div>
</template>

<script>

  import * as _ from 'lodash';
  import * as L from 'leaflet';
  import Vue2Leaflet from 'vue2-leaflet';
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import { createNoteFromNode } from './../util/overPassNodeUtils';
  import { routes } from './../router';
  import mapUtils from './../util/mapUtils';
  import { storeViewPort, getInitialPosition } from './../util/positionUtil';
  import { setError } from '../store/error';

  const zoomOnSelect = 18;
  const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

  let map;
  let component;
  let tileLayer;

  function setMapPosition(pos, zoom) {
    map.setView(pos, zoom || zoomOnSelect);
  }

  let markers = [];

  function clearMarkers() {
    markers.forEach((m) => {
      map.removeLayer(m);
    });
  }

  function getNodesInViewPort(nodes, viewPort) {
    const bbox = viewPort.boundingBox;
    return nodes.filter(n =>
      n.lat >= bbox.south && n.lat <= bbox.north && n.lng >= bbox.west && n.lng <= bbox.east,
    );
  }

  function mergeNodes(all, mine) {
    return _.unionBy(mine, all, b => b.id);
  }

  function addMarkers(bs, ownedNodes, viewport) {
    const mine = getNodesInViewPort(ownedNodes, viewport);
    const merge = mergeNodes(bs, mine);
    markers = merge.map((b) => {
      const m = mapUtils.createMarker(b, map, component);
      map.addLayer(m);
      return m;
    });
  }

  function setTileMode(mode) {
    tileLayer.setUrl(mapUtils.getTileUrl(mode), false);
  }

  function drawBusinesses(businesses, ownedNodes, viewport) {
    clearMarkers();
    addMarkers(businesses, ownedNodes, viewport);
  }

  export default {
    mounted() {
      component = this;
      map = this.$refs.map.mapObject;
      tileLayer = mapUtils.makeTileLayer(this.mode);
      map.addLayer(tileLayer);

      tileLayer.on('tileerror', () => {
        setError('Karte konnte nicht geladen werden');
      });

      this.$store.subscribe((mut) => {
        if (mut.type === 'setMapPosition') {
          setMapPosition(this.position);
          this.viewChange();
        } else if (mut.type === 'setBusinesses') {
          drawBusinesses(this.businesses, this.ownedNodes, this.viewPort);
        } else if (mut.type === 'setMode') {
          setTileMode(this.mode);
        }
      });

      map.attributionControl.addAttribution(attribution);

      if (this.position) {
        setMapPosition(this.position);
      } else {
        getInitialPosition(this.$router.currentRoute.params).then((pos) => {
          setMapPosition(pos.cords, pos.zoom);
        });
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
        'setOsmId',
      ]),
      viewChange() {
        const bbox = map.getBounds();
        const zoom = map.getZoom();
        this.setViewPort({
// eslint-disable-next-line no-underscore-dangle
          topRight: bbox._northEast,
// eslint-disable-next-line no-underscore-dangle
          bottomLeft: bbox._southWest,
          zoom,
        });
        storeViewPort(bbox, zoom, this.$router);
        this.queryOverpass(this.viewPort);
      },
      edit(business) {
        const note = createNoteFromNode(business);
        this.setDetails(note);
        const pos = L.latLng(business.lat, business.lng);
        this.setCoords(pos);
        this.setOsmId(business.id);
        this.setIsNote(true);
        this.$router.push({ name: routes.Detail });
      },
      contextMenu(event) {
        mapUtils.createPopup(map, event.latlng, this);
      },
      createNew(coords) {
        this.setCoords(coords);
        this.setIsNote(false);
        this.setDetails({
          category: {
            text: '',
            value: 0,
            fields: [
              { key: '', name: '', value: '' },
            ],
          },
          name: '',
          opening_hours: '',
          phone: '',
          email: '',
          website: '',
          wheelchair: '',
          description: '',
          note: '',
        });
        this.$router.push({ name: routes.Detail });
      },
    },
    computed: {
      ...mapGetters([
        'mapPosition',
        'position',
        'viewPort',
        'businesses',
        'mode',
        'isLoggedIn',
        'ownedNodes',
      ]),
    },

    name: 'tile-map',
    components: {
      'v-map': Vue2Leaflet.Map,
      'v-tilelayer': Vue2Leaflet.TileLayer,
      'v-marker': Vue2Leaflet.Marker,
    },
  };
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
