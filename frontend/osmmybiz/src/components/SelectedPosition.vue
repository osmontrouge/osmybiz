<template>
  <div v-if="position" class="position-wrapper">
    {{lat}} {{lng}}
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'position'
      ]),
      lat () {
        return this.position.lat.toFixed(4)
      },
      lng () {
        return this.position.lng.toFixed(4)
      }
    },
    name: 'selected-position'
  }

</script>

<style>

  .position-wrapper {
    background-color: white;
    position: fixed;
    height:60px;
    width: 200px;
    z-index: 99;
    left: 50%;
    margin-left: -101px;
    bottom:50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #7ebc6f;
  }
</style>
