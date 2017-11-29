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
    bottom: 50%;
    left: 0;
    right: 0;
    z-index: 100;
    color: white;
    padding: 10px;
  }
</style>
