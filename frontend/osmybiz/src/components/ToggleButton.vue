<template>

  <div class="toggle-wrapper">
    <button @click="setSatellite()" v-if="isTiles">{{t('landing').satelite}}</button>
    <button @click="setTiles()" v-if="isSatellite">{{t('landing').map}}</button>
  </div>

</template>
<script>
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    methods: {
      ...mapMutations(['setMode']),
      setTiles () {
        this.setMode('tiles')
      },
      setSatellite () {
        this.setMode('satellite')
      }
    },
    computed: {
      ...mapGetters([
        'mode'
      ]),
      isSatellite () {
        return this.mode === 'satellite'
      },
      isTiles () {
        return this.mode === 'tiles'
      }
    },
    name: 'toggle-button'
  }
</script>
<style>
  .toggle-wrapper {
    position: fixed;
    z-index: 99;
    bottom:50px;
    right: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    font-size: 16px;
  }
</style>
