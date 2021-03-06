<template>
  <div class="watchlist-wrapper" v-if="showWatchList">
    <div class="watchlist-title">
      <div>
          {{ $t('landing.watchlist.title') }}
      </div>
      <div>
        <img class="info"
             @mouseenter="showPopup($t('landing.watchlist.info'))"
             @mouseleave="hidePopup()"
             src="../../assets/info_black.png">
      </div>
      <div :title="$t('landing.watchlist.icon.refresh')" @click="getUpdate">
        <icon class="refresh" name="sync" scale="1.2"></icon>
      </div>
    </div>
    <div class="watchlist" v-for="(subscribedBusinessPOI, index) in subscribedBusinessPOIs">
      <div class="watchlist-index">
        {{ index + 1 }}
      </div>
      <div class="watchlist-name" @click="panToMarker(subscribedBusinessPOI)">
        <span v-if="subscribedBusinessPOI.tags.name"> {{subscribedBusinessPOI.tags.name}} </span>
        <span v-else> Name not found </span>
      </div>

      <div class="watchlist-icons" :title="noteStatus(subscribedBusinessPOI)">
        <img :src="noteIcon(subscribedBusinessPOI.noteIsResolved)">
      </div>

      <div class="watchlist-icons" :title="updateStatus(subscribedBusinessPOI)">
        <img style="width:14px" :src="updateIcon(subscribedBusinessPOI.hasUpdate)">
      </div>

      <div class="watchlist-icons" :title="$t('landing.watchlist.icon.close')" @click="removeMarker(subscribedBusinessPOI)">
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
      ...mapMutations([
        'setMapCenter',
        'setMapZoom',
        'showPopup',
        'hidePopup',
        'setMapViewToCoordsZoom',
      ]),
      ...mapActions(['removeFromWatchList', 'loadUpdates']),
      panToMarker(subscribedBusinessPOI) {
        const coords = latLng(subscribedBusinessPOI.lat, subscribedBusinessPOI.lng);
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
      removeMarker(subscribedBusinessPOI) {
        this.removeFromWatchList({ subscribedBusinessPOI, user: this.user });
      },
      noteIcon(noteIsResolved) {
        return noteIsResolved ? resolvedNote : unresolvedNote;
      },
      updateIcon(hasUpdate) {
        return hasUpdate ? updatedIcon : notUpdatedIcon;
      },
      noteStatus(subscribedBusinessPOI) {
        if (subscribedBusinessPOI.noteIsResolved) {
          return this.$t('landing.watchlist.icon.noteResolved');
        }
        if (subscribedBusinessPOI.noteId === null) {
          return this.$t('landing.watchlist.icon.noteNull');
        }
        return this.$t('landing.watchlist.icon.notePending');
      },
      updateStatus(subscribedBusinessPOI) {
        if (subscribedBusinessPOI.hasUpdate) {
          return this.$t('landing.watchlist.icon.updateDetected');
        }
        return this.$t('landing.watchlist.icon.updatePending');
      },
      getUpdate() {
        this.loadUpdates(this.user);
      },
    },
    computed: {
      ...mapGetters([
        'subscribedBusinessPOIs',
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
    display: flex;
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    border-bottom: #006600;
  }

  .refresh {
    position: absolute;
    right: 15px;
    cursor: pointer
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
