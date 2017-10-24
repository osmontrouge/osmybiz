<template>
  <div>
    <p>Ihre Adresse wurde erfolgreich gefunden und gespeichert: ({{lat}} / {{lon}})</p>

    {{address.address}}

    <detail-form v-if="!displaySuccess"></detail-form>
    <post-note-success v-if="displaySuccess"></post-note-success>
  </div>
</template>

<script>
  import DetailForm from '@/components/DetailForm'
  import PostNoteSuccess from '@/components/PostNoteSuccess'
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  /* import {routes} from './../router'
  import * as _ from 'lodash' */

  export default {
    mounted () {
      /* if (!_.isNumber(this.lat) || !_.isNumber(this.lon)) {
        this.$router.push({name: routes.Landing})
      } */
      this.getAddress()
    },
    components: {
      DetailForm,
      PostNoteSuccess
    },
    computed: {
      ...mapGetters([
        'lon',
        'lat',
        'displaySuccess',
        'address'
      ])
    },
    methods: {
      ...mapActions([
        'getAddress'
      ]),
      ...mapMutations([
        'setDisplaySuccess'
      ])
    }
  }
</script>

<style>
</style>
