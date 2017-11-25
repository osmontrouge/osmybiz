<template>
  <div class="popup">
    <span>{{infoText}}</span>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'form-popup',
    computed: {
      ...mapGetters([
        'infoText'
      ])
    }
  }
</script>

<style scoped>
  .popup {
    background: #7ebc6f;
    display: block;
    position: absolute;
    margin: 0 auto;
    top: 35%;
    left: 0;
    right: 0;
    width: 300px;
    z-index: 100;
    color: white;
  }
</style>
