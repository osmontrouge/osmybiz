<template>
  <div>

    <p>Ihre Adresse wurde erfolgreich gefunden und gespeichert: ({{lat}} / {{lon}})</p>

     <detail-form></detail-form>

    <p v-if="displaySuccess">{{note}}</p>

  </div>
</template>

<script>
  import DetailForm from '@/components/DetailForm'
  import {mapGetters, mapActions} from 'vuex'

  export default {

    mounted () {
    },
    components: {
      DetailForm
    },
    computed: {
      ...mapGetters([
        'lon',
        'lat',
        'note',
        'displaySuccess'
      ])
    },
    methods: {
      ...mapActions([
        'postNote'
      ]),
      postNote () {
        this.postNote()
      }
    }
  }
</script>

<style>
</style>
