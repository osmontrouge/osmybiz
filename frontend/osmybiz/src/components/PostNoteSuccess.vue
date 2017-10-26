<template>

  <div class="success-wrapper">
    <p>Sind diese Informationen richtig?</p>

    <p v-html="note.html"></p>

    <div class="success-buttons">
      <button @click="gotoLanding()">Alles richtig</button>
      <button @click="gotoDetail()">Informationen anpassen</button>
    </div>
  </div>

</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'post-note-success',
    computed: {
      ...mapGetters([
        'note'
      ])
    },
    methods: {
      ...mapMutations([
        'setDisplaySuccess',
        'setDetails'
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
        this.setDisplaySuccess(false)
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
