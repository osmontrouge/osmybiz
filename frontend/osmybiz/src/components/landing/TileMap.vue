<template>
  <div class="map-wrapper">
    <l-map
      ref="map"
      class="map"
      :zoom="mapZoom"
      :center="mapPosition"
      @update:bounds="viewChange"
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
  import _ from 'lodash';
  import VBusinessMarkerPopup from '../map/VBusinessMarkerPopup.vue';
  import VNewBusinessPopup from '../map/VNewBusinessPopup.vue';
  import { storeViewPort } from '../../util/positionUtil';
  import { initialPosition, initialZoom, mapBoxToken } from '../../config/config';

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
        map: null,
      };
    },
    created() {
      if (!this.position) {
        this.setMapPosition(initialPosition);
      }
      if (!this.mapZoom) {
        this.setMapZoom(initialZoom);
      }
    },
    mounted() {
      this.map = this.$refs.map.mapObject;
      let { lat, lng, zoom } = this.$router.currentRoute.params;
      [lat, lng, zoom] = [Number(lat), Number(lng), Number(zoom)];
      if (!Number.isNaN(lat) && !Number.isNaN(lng) && !Number.isNaN(zoom)) {
        const mapCenter = L.latLng(lat, lng);
        this.map.setView(mapCenter, zoom);
        this.queryOverpass(this.viewPort);
      } else {
        // on load trigger manually if no predefined values from route
        this.viewChange();
      }
    },
    methods: {
      ...mapActions(['queryOverpass', 'checkDuplicateNote']),
      ...mapMutations([
        'setViewPort',
        'setDetails',
        'setCoords',
        'setIsNote',
        'setMapPosition',
        'setOsmId',
        'setMapZoom',
      ]),
      viewChange() {
        const zoom = this.map.getZoom();
        const bounds = this.map.getBounds();
        this.setViewPort({
          bounds,
          zoom,
        });
        storeViewPort(bounds, zoom, this.$router);
        this.queryOverpass(this.viewPort);
      },
      getOwnedNodesInViewPort() {
        const bbox = this.viewPort.boundingBox;
        return this.ownedNodes.filter(n =>
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
        'mapPosition',
        'mapZoom',
        'viewPort',
        'businesses',
        'mode',
        'isLoggedIn',
        'ownedNodes',
      ]),
      allBusinesses() {
        let mine = [];
        if (this.viewPort) {
          mine = this.getOwnedNodesInViewPort();
        }
        return _.unionBy(mine, this.businesses, b => b.id);
      },
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
