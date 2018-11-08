<template>
  <div class="own-business-wrapper" v-if="showBusinessRecord">
    <div class="own-business-title">
      Your Edits
    </div>
    <div class="own-business" v-for="ownedNode in ownedNodes" @click="zoomOverToTheMarker(ownedNode)">
      <div class="own-business-name">
        {{ownedNode.tags.name}}
      </div>
      <div @click="removeMarker(ownedNode)">
        <icon class="close" name="times"></icon>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import 'vue-awesome/icons';
  import { latLng } from 'leaflet';
  import Icon from 'vue-awesome/components/Icon.vue';

  export default {
    methods: {
      ...mapMutations(['setMapPosition', 'setMapZoom']),
      ...mapActions(['deleteOwnedNode']),
      zoomOverToTheMarker(ownedNode) {
        const coords = latLng(ownedNode.lat, ownedNode.lng);
        this.setMapZoom(18);
        this.setMapPosition(coords);
      },
      removeMarker(ownedNode) {
        this.deleteOwnedNode({ ownedNode, user: this.user });
      },
    },
    computed: {
      ...mapGetters([
        'ownedNodes',
        'user',
        'showBusinessRecord',
      ]),
    },
    components: {
      Icon,
    },
    name: 'business-record',
  };
</script>

<style lang="scss">

  @import "../../scss/globals";

  .close {
    color: $error-color;
  }

  .own-business-name {
    border-bottom: dashed 1px $primary-color;
    width: -webkit-fill-available;

  }

  .own-business-wrapper {
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

  .own-business-title {
    font-size:20px;
    font-weight:bold;
    text-align: left;
    color: $primary-color;
  }

  .own-business {
    margin-top: 12px;
    margin-bottom: 12px;
    text-align: left;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .own-business:hover {
    background-color: rgba(126, 188, 111, 0.71);
    cursor: pointer;
  }

  .actions {
    display: flex;
    justify-content: flex-start;
    margin-top: 12px;
  }

</style>
