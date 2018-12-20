<template>
  <l-marker
    ref="popup"
    v-if="business"
    :key="business.id"
    :visible="visibility"
    :draggable="draggable"
    :lat-lng="position"
    :icon="icon"
  >
    <l-popup :lat-lng="position" :options="{minWidth: 240, maxWidth: 240, autoPanPadding: autoPanPadding}" class="popup-data">
      <div class="popup-title">
        {{tooltipText}}
      </div>
      {{prettyAddress}}

      <div class="popup-options">

        <div v-if="isNewBusiness">
          <div class="popup-option" :title="$t('popups.create')">
            <div class="popup-clickable" v-if="isLoggedIn" @click="createNew">
              <icon name="plus-circle" scale="3"></icon>
            </div>
            <div v-else class="popup-not-clickable">
              <icon name="plus-circle" scale="3"></icon>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="popup-option" :title="$t('popups.edit')">
            <div class="popup-clickable" v-if="isLoggedIn" @click="edit">
              <icon name="pen" scale="3"></icon>
            </div>
            <div v-else class="popup-not-clickable">
              <icon name="pen" scale="3"></icon>
            </div>
          </div>
        </div>

        <div class="popup-option">
          <a class="popup-clickable" v-if="this.business.noteId" :href="linkToOsmNote" target="_blank">
            <img style="width: 40px" :src="noteGreen" :title="$t('popups.noteLink')">
          </a>
          <div class="popup-not-clickable" v-else>
            <img style="width: 40px" :src="noteGrey" :title="$t('landing.watchlist.icon.noteNull')">
          </div>
        </div>

        <div class="popup-option">
          <a class="popup-clickable" v-if="this.business.id > 0" :href="linkToOsmElement" target="_blank">
            <img :src="updatedIcon" :title="$t('popups.mapLink')">
          </a>
          <a class="popup-not-clickable" v-else>
            <img :src="notUpdatedIcon" :title="$t('popups.noElement')">
          </a>
        </div>
      </div>

    </l-popup>
    <l-tooltip :content="tooltipText" />
  </l-marker>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { LMarker, LPopup, LTooltip } from 'vue2-leaflet';
  import 'vue-awesome/icons';
  import Icon from 'vue-awesome/components/Icon.vue';
  import * as L from 'leaflet';
  import { reverseQuery } from '../../api/nominatimApi';
  import { routes } from '../../router';
  import { createNoteFromBusinessPOI, getBizCategory } from '../../util/overPassNodeUtils';
  import { osmUrl } from '../../config/config';
  import noteGrey from '../../assets/note.png';
  import noteGreen from '../../assets/note-green.png';
  import notUpdatedIcon from '../../assets/update.png';
  import updatedIcon from '../../assets/update-green.png';

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
    mounted() {
      this.$refs.popup.mapObject.on('popupopen', () => {
        this.loadAddress();
      });
      if (this.isNewBusiness) {
        /* eslint-disable no-underscore-dangle */
        this.$nextTick(() => {
          this.loadAddress();
          // clears the event
          this.$refs.popup.mapObject._events.click = {};
          const popup = this.$refs.popup.mapObject._popup;
          this.map.openPopup(popup._content, popup._latlng, popup.options);
        });
        /* eslint-enable no-underscore-dangle */
      }
    },
    components: {
      Icon,
      LMarker,
      LPopup,
      LTooltip,
    },
    props: {
      business: {
        required: true,
      },
    },
    data() {
      return {
        address: {},
        draggable: false,
        autoPanPadding: L.point(100, 280),
        osmUrl,
        noteGrey,
        noteGreen,
        notUpdatedIcon,
        updatedIcon,
      };
    },
    computed: {
      ...mapGetters([
        'isLoggedIn',
        'subscribedBusinessPOIs',
        'map',
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
        if (this.isNewBusiness) {
          return null;
        }
        return this.business.mine ? highlightedMarker : bizMarker;
      },
      tooltipText() {
        if (this.isNewBusiness) {
          return this.$t('popups.popuptitle');
        }
        if (this.isNoteWithoutElement) {
          return 'This is just a note';
        }
        const category = getBizCategory(this.business);
        const name = this.business.tags.name || '';
        if (category.text) {
          return `${category.text} ${name}`;
        }
        return name;
      },
      position() {
        if (this.isNewBusiness) {
          return this.business;
        }
        return L.latLng(this.business.lat, this.business.lng);
      },
      visibility() {
        return true;
        // TODO: maybe filter for visibility visible:
        // n.lat >= bbox.south && n.lat <= bbox.north && n.lng >= bbox.west && n.lng <= bbox.east,
      },
      isNoteWithoutElement() {
        return (this.business.id < 0);
      },
      linkToOsmElement() {
        if (!this.isNoteWithoutElement) {
          return `${osmUrl}/${this.business.type}/${this.business.id}#map=19/${this.position.lat}/${this.position.lng}&layers=N`;
        }
        return `${osmUrl}/note/${this.business.noteId}#map=19/&layers=N`;
      },
      linkToOsmNote() {
        return `${osmUrl}/note/${this.business.noteId}#map=19/&layers=N`;
      },
      isNewBusiness() {
        return (!this.business.id);
      },
    },
    methods: {
      ...mapMutations([
        'setViewPort',
        'setDetails',
        'setCoords',
        'setIsNote',
        'setOsmId',
        'setNoteId',
        'setOsmType',
      ]),
      loadAddress() {
        reverseQuery(this.position).then((address) => {
          this.address = address;
        });
      },
      edit() {
        if (this.business.id > 0) {
          const note = createNoteFromBusinessPOI(this.business);
          this.setDetails(note);
        }
        this.setOsmId(this.business.id);
        this.setOsmType(this.business.type);
        this.setIsNote(true);
        const pos = L.latLng(this.business.lat, this.business.lng);
        this.setCoords(pos);
        this.setNoteId(this.business.noteId);
        this.$router.push({ name: routes.Detail });
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
    opacity: 0.3;
  }

  .popup-clickable:hover {
    cursor: pointer;
  }

  .popup-not-clickable:hover {
    cursor: not-allowed;
  }
</style>
