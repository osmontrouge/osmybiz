<template>
  <div class="map-wrapper">
    <l-map
      ref="map"
      class="map"
      :zoom="mapZoom"
      :min-zoom="3"
      :max-bounds="maxBounds"
      :center="mapCenter"
      :max-bounds-viscosity="1"
      @moveend="updateMap()"
      @contextmenu="contextMenu($event)"
      @click="cleanNewBusinessPopups"
    >
      <l-tile-layer
        :url="osmLayer.url"
        :attribution="osmLayer.attribution"
        :visible="mode === 'vector'"
        :options="tileLayerZoomSettings"
      ></l-tile-layer>
      <l-tile-layer
        :url="mapBoxLayer.url"
        :attribution="mapBoxLayer.attribution"
        :token="mapBoxLayer.token"
        :visible="mode === 'satellite'"
        :options="tileLayerZoomSettings"
      ></l-tile-layer>
      <v-business-marker-popup
        v-for="business in allBusinesses"
        :key="business.id"
        :business="business"
      ></v-business-marker-popup>
      <v-business-marker-popup
        v-if="positionWhereContextMenuIsTriggered"
        :key="`${positionWhereContextMenuIsTriggered.lat}_${positionWhereContextMenuIsTriggered.lng}`"
        :business="positionWhereContextMenuIsTriggered"
      ></v-business-marker-popup>
    </l-map>
  </div>
</template>

<script>
  import { LMap, LMarker, LPopup, LTileLayer, LTooltip } from 'vue2-leaflet';
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import _ from 'lodash';
  import VBusinessMarkerPopup from '../map/VBusinessMarkerPopup.vue';
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
        positionWhereContextMenuIsTriggered: null,
        maxBounds: [[-89.98155760646617, -180], [89.99346179538875, 180]],
        tileLayerZoomSettings: { maxNativeZoom: 19, maxZoom: 19 },
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
        const { params } = this.$route;
        this.setUrlParams(params);
        this.setMapViewToUrl();
      });
    },
    watch: {
      $route: function updatePosition(route) {
        const { params } = route;
        this.setUrlParams(params);
        this.setMapViewToUrl();
      },
      '$i18n.locale': function updateBusinessInViewPort() {
        this.queryOverpass(this.viewPort);
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
      getSubscribedBusinessPOIsInViewPort() {
        const bbox = this.viewPort.boundingBox;
        return this.subscribedBusinessPOIs.filter(n =>
          (n.lat >= bbox.south)
          && (n.lat <= bbox.north)
          && (n.lng >= bbox.west)
          && (n.lng <= bbox.east));
      },
      cleanNewBusinessPopups() {
        this.positionWhereContextMenuIsTriggered = null;
      },
      contextMenu(event) {
        this.cleanNewBusinessPopups();
        this.positionWhereContextMenuIsTriggered = event.latlng;
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
        'subscribedBusinessPOIs',
        'urlParams',
        'map',
      ]),
      allBusinesses() {
        let mine = [];
        if (this.viewPort) {
          mine = this.getSubscribedBusinessPOIsInViewPort();
        }
        return _.unionBy(mine, this.businesses, b => b.id);
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

  @media screen and (max-width: 750px) {
    >>> .leaflet-left {
      top: 60px;
    }
  }

</style>
