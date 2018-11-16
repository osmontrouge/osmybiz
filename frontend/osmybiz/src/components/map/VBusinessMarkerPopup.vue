<template>
  <l-marker
    v-if="business"
    :key="business.id"
    :visible="visibility"
    :draggable="draggable"
    :lat-lng="position"
    :icon="icon"
    :title="tooltipText"
    @click="loadAddress"
  >
    <l-popup :options="{minWidth: 240, maxWidth: 240, autoPanPadding: autoPanPadding}" class="popup-data">
      <div class="popup-title">{{tooltipText}}</div>
      <div>{{prettyAddress}}</div>
      <button
        v-if="!isLoggedIn"
        title="${this.t('popups').buttontitle}"
        disabled="disabled"
        class="popup-btn"
      >
        {{ $t('popups.edit') }}
      </button>
      <button
        v-else
        class="popup-btn"
        @click="edit"
      >
        {{ $t('popups.edit') }}
      </button>
      <v-map-link class="popup-link" :link="`${osmUrl}/node/${business.id}#map=19/${position.lat}/${position.lng}&layers=N`">{{ $t('popups.mapLink') }}</v-map-link>
      <v-map-link class="popup-link" :link="`${osmUrl}/note/new?lat=${position.lat}&lon=${position.lng}#map=19/${position.lat}/${position.lng}&layers=N`">{{ $t('popups.feedback') }}</v-map-link>
    </l-popup>
    <l-tooltip :content="tooltipText" />
  </l-marker>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { LMarker, LPopup, LTooltip } from 'vue2-leaflet';
  import * as L from 'leaflet';
  import VMapLink from './VMapLink.vue';
  import { reverseQuery } from '../../api/nominatimApi';
  import { routes } from '../../router';
  import { createNoteFromNode, getBizCategory } from '../../util/overPassNodeUtils';
  import { osmUrl } from '../../config/config';

  const bizIcon = require('../../assets/biz-marker.png');
  const highlightIcon = require('../../assets/highlighted-marker.png');

  const bizMarker = L.icon({
    iconUrl: bizIcon,
    iconSize: [32, 32],
  });

  const highlightedMarker = L.icon({
    iconUrl: highlightIcon,
    iconSize: [32, 32],
  });

  export default {
    name: 'v-business-marker-popup',
    components: {
      VMapLink,
      LMarker,
      LPopup,
      LTooltip,
    },
    props: {
      business: {
        required: true,
      },
      businessPosition: {
        required: false,
      },
    },
    data() {
      return {
        address: {},
        draggable: false,
        autoPanPadding: L.point(100, 280),
        osmUrl,
      };
    },
    computed: {
      ...mapGetters([
        'isLoggedIn',
        'ownedNodes',
      ]),
      prettyAddress() {
        let out = '';
        if (this.address.street) {
          out += this.address.street;
          if (this.address.housenumber) {
            out += ` ${this.address.housenumber}`;
          }
        }
        if (this.address.city) {
          out += (out !== '' ? ', ' : '') + this.address.city;
        }
        return out;
      },
      icon() {
        return this.business.mine ? highlightedMarker : bizMarker;
      },
      tooltipText() {
        if (this.business.isNew) {
          return 'New Business';
        }
        const category = getBizCategory(this.business);
        const name = this.business.tags.name || '';
        if (category.text) {
          return `${category.text} ${name}`;
        }
        return name;
      },
      position() {
        if (this.business.lat && this.business.lng) {
          return L.latLng(this.business.lat, this.business.lng);
        }
        return this.businessPosition;
      },
      visibility() {
        return true;
        // TODO: maybe filter for visibility visible:
        // n.lat >= bbox.south && n.lat <= bbox.north && n.lng >= bbox.west && n.lng <= bbox.east,
      },
    },
    methods: {
      ...mapMutations([
        'setViewPort',
        'setDetails',
        'setCoords',
        'setIsNote',
        'setOsmId',
      ]),
      loadAddress() {
        reverseQuery(this.position).then((address) => {
          this.address = address;
        });
      },
      edit() {
        const note = createNoteFromNode(this.business);
        this.setDetails(note);
        const pos = L.latLng(this.business.lat, this.business.lng);
        this.setCoords(pos);
        this.setOsmId(this.business.id);
        this.setIsNote(true);
        this.$router.push({ name: routes.Detail });
      },
    },
  };

</script>
<style>
  .popup-data {
    display: flex;
    flex-direction:column;
    font-size: 16px;
    min-width: 200px;
    align-items: flex-start;
  }

  .popup-title {
    font-weight: bold;
  }

  .popup-link {
    cursor: pointer;
    text-decoration: underline;
  }
</style>
