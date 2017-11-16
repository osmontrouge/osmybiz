<template>
  <div v-if="position" class="position-wrapper">


    <div class="current-position">
      {{position.lat | latLng}} / {{ position.lng | latLng}}
    </div>

    <div>
      <button class="btn" @click="create()">Neues Business</button>
    </div>

  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {routes} from './../router'
  import LatLngFilter from './../filters/latLngFilter'

  export default {
    computed: {
      ...mapGetters([
        'position'
      ])
    },
    methods: {
      ...mapMutations([
        'setCoords'
      ]),
      create () {
        this.setCoords(this.position)
        this.$router.push({name: routes.Detail})
      }
    },
    filters: {
      LatLngFilter
    },
    name: 'selected-position'
  }

</script>

<style>

  .position-wrapper {
    background-color: white;
    position: fixed;
    height:90px;
    width: 200px;
    z-index: 99;
    left: 50%;
    margin-left: -101px;
    bottom:50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px solid #7ebc6f;
  }

  .btn {
    position: relative;
    left: 0;
    margin-left: 0;
    width: auto;
  }

</style>
