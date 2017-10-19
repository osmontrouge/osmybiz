<template>
  <div>
    <p>Ihre Adresse wurde erfolgreich gefunden und gespeichert: ({{lat}} / {{lon}})</p>

    <detail-form v-if="!displaySuccess"></detail-form>
    <post-note-success v-if="displaySuccess"></post-note-success>
  </div>
</template>

<script>
  import DetailForm from '@/components/DetailForm'
  import PostNoteSuccess from '@/components/PostNoteSuccess'
  import {mapGetters, mapMutations} from 'vuex'
  import {routes} from './../router'

  export default {
    mounted () {
      if (isNaN(this.lat) || isNaN(this.lon)) {
        this.$router.push({name: routes.Landing})
      }
    },
    components: {
      DetailForm,
      PostNoteSuccess
    },
    computed: {
      ...mapGetters([
        'lon',
        'lat',
        'displaySuccess'
      ])
    },
    methods: {
      ...mapMutations([
        'setDisplaySuccess'
      ])
    }
  }
</script>

<style>
</style>
