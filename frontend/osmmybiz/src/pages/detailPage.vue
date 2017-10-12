<template>
  <div>

    <p>Ihre Adresse wurde erfolgreich gefunden und gespeichert: ({{lat}} / {{lon}})</p>

     <detail-form></detail-form>
  </div>
</template>

<script>
  import DetailForm from '@/components/detail-form'
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
        'lat'
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
