<template>
  <div>

    <p>Ihre Adresse wurde erfolgreich gefunden und gespeichert: ({{lat}} / {{lon}})</p>

    <detail-form v-if="!displaySuccess"></detail-form>

    <div v-if="displaySuccess">
      Sind diese Informationen richtig?

      <p>{{note.properties.comments[0].text}}</p>

      <button class="fluid ui button" @click="gotoLanding()">Alles richtig</button>
      <button class="fluid ui button" @click="gotoDetail()">Informationen anpassen</button>
    </div>

  </div>
</template>

<script>
  import DetailForm from '@/components/DetailForm'
  import {mapGetters, mapActions, mapMutations} from 'vuex'

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
      ...mapMutations([
        'setDisplaySuccess'
      ]),
      ...mapActions([
        'postNote'
      ]),
      gotoLanding () {
        this.$router.push('/')
      },
      gotoDetail () {
        this.setDisplaySuccess(false)
        this.$router.push('/detail')
      }
    }
  }
</script>

<style>
</style>
