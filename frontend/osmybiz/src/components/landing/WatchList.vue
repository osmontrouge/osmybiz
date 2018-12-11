<template>
  <div class="watchlist-wrapper" v-if="showWatchList">
    <div class="watchlist-title">
      {{ $t('landing.watchlist.title') }}
    </div>
    <div class="watchlist" v-for="(ownedBusinessPOI, index) in ownedBusinessPOIs" @click="panToMarker(ownedBusinessPOI)">
      <div class="watchlist-index">
        {{ index + 1 }}
      </div>
      <div class="watchlist-name">
        <span v-if="ownedBusinessPOI.tags.name"> {{ownedBusinessPOI.tags.name}} </span>
        <span v-else> Name not found </span>
      </div>

      <div class="watchlist-icons">
        <img :src="noteIcon(ownedBusinessPOI.noteIsResolved)">
      </div>

      <div class="watchlist-icons">
        <img style="width:14px" :src="updateIcon(ownedBusinessPOI.hasUpdate)">
      </div>

      <div class="watchlist-icons" @click="removeMarker(ownedBusinessPOI)">
        <icon class="close" name="times"></icon>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import 'vue-awesome/icons';
  import { latLng } from 'leaflet';
  import deepEqual from 'deep-equal';
  import Icon from 'vue-awesome/components/Icon.vue';
  import unresolvedNote from '../../assets/note.png';
  import resolvedNote from '../../assets/note-green.png';
  import notUpdatedIcon from '../../assets/update.png';
  import updatedIcon from '../../assets/update-green.png';

  export default {
    data() {
      return {
        unresolvedNote,
        resolvedNote,
        notUpdatedIcon,
        updatedIcon,
      };
    },
    methods: {
      ...mapMutations(['setMapCenter', 'setMapZoom', 'setMapViewToCoordsZoom']),
      ...mapActions(['removeFromWatchList']),
      panToMarker(ownedBusinessPOI) {
        const coords = latLng(ownedBusinessPOI.lat, ownedBusinessPOI.lng);
        const zoom = 17;
        this.setMapViewToCoordsZoom({ coords, zoom });
        /* eslint-disable */
        this.$nextTick(() => {
          const targets = this.map._targets;
          for (let i in targets) {
            if (deepEqual(targets[i]._latlng, coords)) {
              // TODO refactor this ugly code. Can refer to https://leafletjs.com/reference-1.3.4.html#popup
              const popup = targets[i].dragging._marker._popup;
              this.map.openPopup(popup._content, coords, popup.options);
            }
          }
        });
        /* eslint-enable */
      },
      removeMarker(ownedBusinessPOI) {
        this.removeFromWatchList({ ownedBusinessPOI, user: this.user });
      },
      noteIcon(noteIsResolved) {
        return noteIsResolved ? resolvedNote : unresolvedNote;
      },
      updateIcon(hasUpdate) {
        return hasUpdate ? updatedIcon : notUpdatedIcon;
      },
    },
    computed: {
      ...mapGetters([
        'ownedBusinessPOIs',
        'user',
        'showWatchList',
        'map',
      ]),
    },
    components: {
      Icon,
    },
    name: 'watchlist',
  };
</script>

<style lang="scss">

  @import "../../scss/globals";

  .close {
    color: $error-color;
  }

  .watchlist-index {
    padding-right: 7px;
  }

  .watchlist-name {
    border-bottom: dashed 1px $primary-color;
    width: -webkit-fill-available;

  }

  .watchlist-name:hover {
    background-color: rgba(126, 188, 111, 0.71);
    cursor: pointer;
  }

  .watchlist-name span {
    word-break: break-word;
  }


  .watchlist-wrapper {
    position: fixed;
    z-index: 99;
    bottom: 110px;
    top: 74px;
    right: 24px;
    width: 250px;
    font-size: 14px;
    background-color: white;
    border: 2px solid $primary-color;
    padding: 12px;
    overflow-y: auto;
  }

  .watchlist-title {
    font-size:20px;
    font-weight:bold;
    text-align: left;
    border-bottom: #006600;
  }

  .watchlist {
    margin-top: 12px;
    margin-bottom: 12px;
    text-align: left;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: bold;
  }

  .watchlist img {
    width: 12px;
    height: 16px;
  }

  .watchlist-icons {
    padding-left: 7px;
  }

  .watchlist-icons:hover {
    cursor: pointer;
    opacity: 0.5;
  }

  .actions {
    display: flex;
    justify-content: flex-start;
    margin-top: 12px;
  }
</style>
