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

      <div class="popup-options">
        <div class="popup-option" :title="$t('popups.create')">
          <div class="popup-clickable" v-if="isLoggedIn" @click="createNew">
            <icon name="pen" scale="3"></icon>
          </div>
          <div v-else class="popup-not-clickable">
            <icon name="pen" scale="3"></icon>
          </div>
        </div>
        <div class="popup-option">
          <div class="popup-not-clickable">
            <img style="width: 40px" :src="noteGrey" :title="$t('landing.watchlist.icon.noteNull')">
          </div>
        </div>
        <div class="popup-option">
          <a class="popup-not-clickable">
            <img :src="notUpdatedIcon" :title="$t('popups.noElement')">
          </a>
        </div>
      </div>
    </v-popup-open>
  </l-marker>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { LMarker, LTooltip } from 'vue2-leaflet';
  import * as L from 'leaflet';
  import 'vue-awesome/icons';
  import Icon from 'vue-awesome/components/Icon.vue';
  import VMapLink from './VMapLink.vue';
  import { reverseQuery } from '../../api/nominatimApi';
  import { routes } from '../../router';
  import { osmUrl } from '../../config/config';
  import VPopupOpen from './VPopupOpen.vue';
  import noteGrey from '../../assets/note.png';
  import notUpdatedIcon from '../../assets/update.png';


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
      noteGrey,
      notUpdatedIcon,
      Icon,
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
        noteGrey,
        notUpdatedIcon,
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
<style scoped lang="scss">
  @import "../../scss/globals";

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

  .popup-options {
    display: flex;
  }

  .popup-option {
    margin: 15px;
  }

  .popup-option img {
    height: 48px;
    width: 48px;
  }

  .popup-clickable {
    color: $primary-color;
  }

  .popup-not-clickable {
    color: grey;
  }

  .popup-clickable:hover {
    cursor: pointer;
  }

  .popup-not-clickable:hover {
    cursor: not-allowed;
  }
</style>
