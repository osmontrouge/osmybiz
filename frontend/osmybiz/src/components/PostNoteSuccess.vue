<template>

  <div class="success-wrapper">
    Sind diese Informationen richtig?

    <p>{{note.text}}</p>

    <div class="success-buttons">
      <button @click="gotoLanding()">Alles richtig</button>
      <button @click="gotoDetail()">Informationen anpassen</button>
    </div>
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
        'noteString',
        'displaySuccess'
      ])
    },
    methods: {
      ...mapMutations([
        'setDisplaySuccess',
        'setNoteString',
        'setDetails'
      ]),
      ...mapActions([
        'postNote'
      ]),
      gotoLanding () {
        this.setDetails({
          category: {
            text: '',
            value: 0
          },
          name: '',
          openinghours: '',
          phonenumber: '',
          email: '',
          website: '',
          wheelchair: false,
          description: '',
          note: ''
        })
        this.$router.push('/')
      },
      gotoDetail () {
        this.$router.push('/detail')
      }
    }
  }
</script>

<style scoped>
  .success-wrapper {
    max-width:750px;
    margin: 20px auto 20px auto;
  }

  .success-buttons {
    display: flex;
    flex-direction: row;
  }

  button {
    margin: auto;
  }
</style>
