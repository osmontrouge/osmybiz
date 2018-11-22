<template>
  <div class="map-wrapper">
    <l-map
      ref="map"
      class="map"
      :zoom="mapZoom"
      :min-zoom="3"
      :center="mapCenter"
      :max-bounds="bounds"
      :max-bounds-viscosity="1"
      @moveend="updateMap()"
      @contextmenu="contextMenu($event)"
      @click="cleanNewBusinessPopups"
    >
      <l-tile-layer
        :url="osmLayer.url"
        :attribution="osmLayer.attribution"
        :visible="mode === 'vector'"
      ></l-tile-layer>
      <l-tile-layer
        :url="mapBoxLayer.url"
        :attribution="mapBoxLayer.attribution"
        :token="mapBoxLayer.token"
        :visible="mode === 'satellite'"
      ></l-tile-layer>
      <v-business-marker-popup
        v-for="business in allBusinesses"
        v-if="business.id"
        :key="business.id"
        :business="business"
      ></v-business-marker-popup>
      <v-new-business-popup
        v-for="newBusinessPosition in newBusinessPositions"
        :key="`${newBusinessPosition.lat}_${newBusinessPosition.lng}`"
        :businessPosition="newBusinessPosition"
      ></v-new-business-popup>
    </l-map>
  </div>
</template>

<script>
  import { LMap, LMarker, LPopup, LTileLayer, LTooltip } from 'vue2-leaflet';
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import * as L from 'leaflet';
  import deepEqual from 'deep-equal';
  import _ from 'lodash';
  import VBusinessMarkerPopup from '../map/VBusinessMarkerPopup.vue';
  import VNewBusinessPopup from '../map/VNewBusinessPopup.vue';
  import { initialPosition, initialZoom, mapBoxToken, LatLngRoundingAccuracy } from '../../config/config';
  import { routes } from '../../router';

  export default {
    name: 'tile-map',
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
      LTooltip,
      VNewBusinessPopup,
      VBusinessMarkerPopup,
    },
    data() {
      return {
        osmLayer: {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        },
        mapBoxLayer: {
          url: `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg70?access_token=${mapBoxToken}`,
          attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">&copy; Mapbox</a> <a href="https://openstreetmap.org/about/" target="_blank">&copy; OpenStreetMap</a> <a class="mapbox-improve-map" href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a> <a href="https://www.digitalglobe.com/" target="_blank">&copy; DigitalGlobe</a>',
          token: mapBoxToken,
        },
        newBusinessPositions: [],
        bounds: L.latLngBounds(L.latLng(-89.98155760646617, -180), L.latLng(89.99346179538875, 180)),
      };
    },
    created() {
      if (!this.mapCenter) {
        this.setMapCenter(initialPosition);
      }
      if (!this.mapZoom) {
        this.setMapZoom(initialZoom);
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.setMap(this.$refs.map.mapObject);
        this.setMapViewToUrl();
      });
    },
    watch: {
      computedUrlParams: function updatePosition() {
        this.setMapViewToUrl();
      },
    },
    methods: {
      ...mapActions(['queryOverpass', 'checkDuplicateNote']),
      ...mapMutations([
        'setViewPort',
        'setDetails',
        'setCoords',
        'setIsNote',
        'setMapCenter',
        'setOsmId',
        'setMapZoom',
        'setMapViewToUrl',
        'setUrlParams',
        'setMap',
        'setLastKnownPosition',
      ]),
      updateMap() {
        /* Note that the moveend event is triggered in the landing page as well
        so the following line is required */
        if (this.isDetailPage) {
          return;
        }
        const zoom = this.map.getZoom();
        const coords = this.map.getCenter();
        const lat = coords.lat.toFixed(LatLngRoundingAccuracy);
        const lng = coords.lng.toFixed(LatLngRoundingAccuracy);

        // update url to leaflet position
        this.$router.push({ name: routes.Landing, params: { zoom, lat, lng } });

        // saves last-known-position in local storage
        this.setLastKnownPosition({ coords, zoom });

        const bounds = this.map.getBounds();
        this.setViewPort({
          bounds,
          zoom,
        });

        // update business by making overpass query based on the leaflet bounds
        this.queryOverpass(this.viewPort);
      },
      getOwnedBusinessPOIsInViewPort() {
        const bbox = this.viewPort.boundingBox;
        return this.ownedBusinessPOIs.filter(n =>
          (n.lat >= bbox.south)
          && (n.lat <= bbox.north)
          && (n.lng >= bbox.west)
          && (n.lng <= bbox.east));
      },
      cleanNewBusinessPopups() {
        if (this.newBusinessPositions.length >= 1) {
          this.newBusinessPositions.splice(0, this.newBusinessPositions.length);
        }
      },
      contextMenu(event) {
        // TODO: Cleanup this ugly code!
        this.cleanNewBusinessPopups();
        _.delay((latLng) => {
          this.newBusinessPositions.push(latLng);
        }, 100, event.latlng);
      },
    },
    computed: {
      ...mapGetters([
        'mapCenter',
        'mapZoom',
        'viewPort',
        'businesses',
        'mode',
        'isLoggedIn',
        'ownedBusinessPOIs',
        'urlParams',
        'map',
      ]),
      allBusinesses() {
        let mine = [];
        if (this.viewPort) {
          mine = this.getOwnedBusinessPOIsInViewPort();
        }
        return _.unionBy(mine, this.businesses, b => b.id);
      },
      computedUrlParams() {
        const { params } = this.$route;
        if (deepEqual(this.urlParams, params)) {
          return false;
        }
        this.setUrlParams(params);
        return params;
      },
      isDetailPage() {
        return (this.$route.name === routes.Detail);
      },
    },
  };
</script>

<style scoped>

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
