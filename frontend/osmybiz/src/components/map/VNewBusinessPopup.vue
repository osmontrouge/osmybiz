<template>
  <l-marker
    :lat-lng="businessPosition"
    :draggable="false"
    :title="$t('popups.popuptitle')"
  >
    <v-popup-open
      ref="actionpopup"
      :options="{minWidth: 240, maxWidth: 240, autoPanPadding: autoPanPadding}"
      class="popup-data"
      :lat-lng="position"
    >
      <div class="popup-title">{{ $t('popups.popuptitle') }}</div>
      <div v-if="prettyAddress">{{prettyAddress}}</div>
      <button
        v-if="!isLoggedIn"
        title="${this.t('popups').buttontitle}"
        disabled="disabled"
        class="popup-btn"
      >
        {{ $t('popups.create') }}
      </button>
      <button
        v-else
        class="popup-btn"
        @click="createNew"
      >
        {{ $t('popups.create') }}
      </button>
      <v-map-link class="popup-link" :link="`${osmUrl}/#map=19/${position.lat}/${position.lng}&layers=N`">{{ $t('popups.mapLink') }}</v-map-link>
      <v-map-link class="popup-link" :link="`${osmUrl}/note/new?lat=${position.lat}&lon=${position.lng}#map=19/${position.lat}/${position.lng}&layers=N`">{{ $t('popups.feedback') }}</v-map-link>
    </v-popup-open>
  </l-marker>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { LMarker, LTooltip } from 'vue2-leaflet';
  import * as L from 'leaflet';
  import VMapLink from './VMapLink.vue';
  import { reverseQuery } from '../../api/nominatimApi';
  import { routes } from '../../router';
  import { osmUrl } from '../../config/config';
  import VPopupOpen from './VPopupOpen.vue';

  const highlightIcon = require('../../assets/highlighted-marker.png');

  export default {
    name: 'v-business-marker-popup',
    props: {
      businessPosition: {
        required: true,
      },
    },
    components: {
      VMapLink,
      LMarker,
      VPopupOpen,
      LTooltip,
    },
    data() {
      return {
        autoPanPadding: L.point(100, 280),
        osmUrl,
        icon: L.icon({
          iconUrl: highlightIcon,
          iconSize: [32, 32],
        }),
        address: null,
      };
    },
    computed: {
      ...mapGetters([
        'isLoggedIn',
        'ownedBusinessPOIs',
      ]),
      prettyAddress() {
        let out = '';
        if (this.address) {
          if (this.address.street) {
            out += this.address.street;
            if (this.address.housenumber) {
              out += ` ${this.address.housenumber}`;
            }
          }

          if (this.address.city) {
            out += (out !== '' ? ', ' : '') + this.address.city;
          }
        }
        return out;
      },
      position() {
        return this.businessPosition;
      },
    },
    watch: {
      position() {
        this.loadAddress();
      },
    },
    methods: {
      ...mapMutations([
        'setViewPort',
        'setDetails',
        'setCoords',
        'setIsNote',
        'setOsmId',
        'setOsmType',
        'setNoteId',
      ]),
      reset() {
        this.address = null;
        this.loadAddress();
      },
      loadAddress() {
        reverseQuery(this.businessPosition).then((address) => {
          this.address = address;
        });
      },
      createNew() {
        this.setCoords(this.position);
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
        this.setNoteId(null);
        this.setOsmType('node');
        this.$router.push({ name: routes.Detail });
      },
    },
  };

</script>
<style scoped>
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
