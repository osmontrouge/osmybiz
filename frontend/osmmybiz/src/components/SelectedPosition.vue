<template>
  <div v-if="position" class="position-wrapper">

    <div class="btn">
      <button @click="create()">Neues Business</button>
    </div>
    {{lat}} {{lng}}
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {routes} from './../router'

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
