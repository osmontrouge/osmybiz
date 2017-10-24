<template>
  <div v-if="position" class="position-wrapper">


    <div class="current-position">
      {{lat}} / {{lng}}
    </div>

    <div>
      <button class="btn" @click="create()">Neues Business</button>
    </div>

  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {routes} from './../router'
  import {LatLngRoundingAccuracy} from "../constants";

  export default {
    computed: {
      ...mapGetters([
        'position'
      ]),
      lat () {
        return this.position.lat.toFixed(LatLngRoundingAccuracy)
      },
      lng () {
        return this.position.lng.toFixed(LatLngRoundingAccuracy)
      }
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
