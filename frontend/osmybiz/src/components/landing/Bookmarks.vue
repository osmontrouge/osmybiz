<template>
  <div class="bookmarks-wrapper" v-if="showBookmarks">
    <div class="bookmarks-title">
      {{ $t('landing.bookmarks.title') }}
    </div>
    <div class="bookmarks" v-for="(ownedNode, index) in ownedNodes" @click="zoomOverToTheMarker(ownedNode)">
      <div class="bookmarks-index">
        {{ index }}
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
  import { routes } from '../../router';

  export default {
    methods: {
      ...mapMutations(['setMapCenter', 'setMapZoom']),
      ...mapActions(['deleteOwnedNode']),
      zoomOverToTheMarker(ownedNode) {
        const coords = latLng(ownedNode.lat, ownedNode.lng);
        const zoom = 17;
        const { lat, lng } = ownedNode;
        this.$router.push({ name: routes.Landing, params: { zoom, lat, lng } });
        /* eslint-disable */
        // needs to wait for the map to update.
        setTimeout(() => {
          const targets = this.map._targets;
          console.log(targets);
          for (let i in targets) {
            if (deepEqual(targets[i]._latlng, coords)) {
              const popup = targets[i].dragging._marker._popup;
              this.map.openPopup(popup._content, coords, popup.options);
            }
          }
        }, 500);
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
