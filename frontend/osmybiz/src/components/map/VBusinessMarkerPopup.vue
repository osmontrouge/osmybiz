<template>
  <l-marker
    v-if="business"
    :key="business.id"
    :visible="visibility"
    :draggable="draggable"
    :lat-lng="position"
    :icon="icon"
    @click="loadAddress"
  >
    <l-popup :options="{minWidth: 240, maxWidth: 240, autoPanPadding: autoPanPadding}" class="popup-data">
      <div class="popup-title">
        {{tooltipText}}
      </div>
      <div v-if="hasOsmId">
        {{prettyAddress}}
      </div>
      <div class="popup-options">
        <div class="popup-option">
          <div class="popup-clickable" v-if="isLoggedIn" @click="edit">
            <icon name="pen" scale="3"></icon>
          </div>
          <div v-else class="popup-not-clickable">
            <icon name="user-edit" scale="3"></icon>
          </div>
        </div>
        <div class="popup-option">
          <a class="popup-clickable" v-if="this.business.noteId" :href="linkToOsmNote" target="_blank">
            <icon name="user-edit" scale="3"></icon>
          </a>
          <div class="popup-not-clickable" v-else>
            <icon name="user-edit" scale="3"></icon>
          </div>
        </div>
        <div class="popup-option">
          <a class="popup-clickable" :href="linkToOsmElement" target="_blank">
            <icon name="user-edit" scale="3"></icon>
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
  import VMapLink from './VMapLink.vue';
  import { reverseQuery } from '../../api/nominatimApi';
  import { routes } from '../../router';
  import { createNoteFromBusinessPOI, getBizCategory } from '../../util/overPassNodeUtils';
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
      Icon,
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
        'ownedBusinessPOIs',
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
        if (!this.hasOsmId) {
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
      hasOsmId() {
        return (this.business.id > 0);
      },
      linkToOsmElement() {
        if (this.hasOsmId) {
          return `${osmUrl}/${this.business.type}/${this.business.id}#map=19/${this.position.lat}/${this.position.lng}&layers=N`;
        }
        return `${osmUrl}/note/${this.business.noteId}#map=19/${this.position.lat}/${this.position.lng}&layers=N`;
      },
      linkToOsmNote() {
        return `${osmUrl}/note/${this.business.noteId}#map=19/&layers=N`;
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

  .popup-link {
    cursor: pointer;
    text-decoration: underline;
  }

  .popup-options {
    display: flex;
  }

  .popup-option {
    margin: 15px;
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
</style>
