<template>
  <div class="update-wrapper" v-if="show">

  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    methods: {
      ...mapMutations(['setShowHelp']),
      confirm () {
        this.setShowHelp(false)
      },
      toggle () {
        this.setShowHelp(!this.showHelp)
      }
    },
    computed: {
      ...mapGetters([
        'isLoggedIn',
        'updates',
        'hasUpdates'
      ]),
      show () {
        this.isLoggedIn && this.hasUpdates
      }
    },
    name: 'update-list'
  }
</script>

<style>

  .update-wrapper {
    position: fixed;
    z-index: 99;
    bottom: 0px;
    top: 0px;
    right: 0px;
    width: 200px;
    font-size: 16px;
  }

</style>
