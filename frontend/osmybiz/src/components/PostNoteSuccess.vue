<template>

  <div class="success-wrapper">
    <div class="note-success" v-if="displayNote">
      <p>Sind diese Informationen richtig?</p>

      <p v-html="note.html"></p>

      <div class="success-buttons">
        <button @click="gotoLanding()">Alles richtig</button>
        <button @click="gotoDetail()">Informationen anpassen</button>
      </div>
    </div>

    <div class="comment-success" v-if="displayComment">
      <p>Änderungen erfolgreich</p>

      <p>
        {{comment}}
      </p>

      <div class="success-buttons">
        <button @click="gotoLanding()">Ok</button>
      </div>
    </div>
  </div>

</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'post-note-success',
    computed: {
      ...mapGetters([
        'note',
        'comment',
        'displayNote',
        'displayComment'
      ])
    },
    methods: {
      ...mapMutations([
        'setDisplaySuccess',
        'setDetails',
        'setIsComment'
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
        this.setIsComment(true)
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
