<template>
  <div class="bookmarks-wrapper" v-if="showBookmarks">
    <div class="bookmarks-title">
      {{ $t('landing.bookmarks.title') }}
    </div>
    <div class="bookmarks" v-for="(ownedNode, index) in ownedNodes" @click="panToMarker(ownedNode)">
      <div class="bookmarks-index">
        {{ index + 1 }}
      </div>
      <div class="bookmarks-name">
        <span v-if="ownedNode.tags.name"> {{ownedNode.tags.name}} </span>
        <span v-else> Name not found </span>
      </div>
      <div class="bookmarks-remove" @click="removeMarker(ownedNode)">
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

  export default {
    methods: {
      ...mapMutations(['setMapCenter', 'setMapZoom', 'setMapViewToCoordsZoom']),
      ...mapActions(['deleteOwnedNode']),
      panToMarker(ownedNode) {
        const coords = latLng(ownedNode.lat, ownedNode.lng);
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
      removeMarker(ownedNode) {
        this.deleteOwnedNode({ ownedNode, user: this.user });
      },
    },
    computed: {
      ...mapGetters([
        'ownedNodes',
        'user',
        'showBookmarks',
        'map',
      ]),
    },
    components: {
      Icon,
    },
    name: 'bookmarks',
  };
</script>

<style lang="scss">

  @import "../../scss/globals";

  .close {
    color: $error-color;
  }

  .bookmarks-index {
    padding-right: 7px;
  }

  .bookmarks-name {
    border-bottom: dashed 1px $primary-color;
    width: -webkit-fill-available;

  }

  .bookmarks-name:hover {
    background-color: rgba(126, 188, 111, 0.71);
    cursor: pointer;
  }

  .bookmarks-wrapper {
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

  .bookmarks-title {
    font-size:20px;
    font-weight:bold;
    text-align: left;
    border-bottom: #006600;
  }

  .bookmarks {
    margin-top: 12px;
    margin-bottom: 12px;
    text-align: left;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: bold;
  }

  .bookmarks-remove {
    padding-left: 7px;
  }

  .bookmarks-remove:hover {
    cursor: pointer;
    opacity: 0.5;
  }

  .actions {
    display: flex;
    justify-content: flex-start;
    margin-top: 12px;
  }
</style>
