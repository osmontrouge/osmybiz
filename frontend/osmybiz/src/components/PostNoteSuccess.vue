<template>

  <div>
    Sind diese Informationen richtig?

    <p>{{note.properties.comments[0].text}}</p>

    <button class="button" @click="gotoLanding()">Alles richtig</button>

    <button class="button" @click="gotoDetail()">Informationen anpassen</button>
  </div>

</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    name: 'post-note-success',
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

<style scoped>

</style>
