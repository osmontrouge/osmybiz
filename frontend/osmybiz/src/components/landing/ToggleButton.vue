<template>

  <div class="toggle-wrapper">
    <button @click="setSatellite()" v-if="isVector">{{ $t('landing.satelite') }}</button>
    <button @click="setVector()" v-if="isSatellite">{{ $t('landing.map') }}</button>
  </div>

</template>
<script>
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'toggle-button',
    methods: {
      ...mapMutations(['setMode']),
      setSatellite() {
        this.setMode('satellite');
      },
      setVector() {
        this.setMode('vector');
      },

    },
    computed: {
      ...mapGetters([
        'mode',
      ]),
      isSatellite() {
        return this.mode === 'satellite';
      },
      isVector() {
        return this.mode === 'vector';
      },
    },
  };
</script>
<style scoped>
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
