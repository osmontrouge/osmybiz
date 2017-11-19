<template>

  <div class="success-wrapper">
    <div class="node-success" v-if="!isNote">
      <p>Neues Business erfolgreich erstellt: </p>

      <p>Node</p>
      <a :href="node.link" target="_blank">Link zum Node</a>
    </div>

    <div class="note-success" v-if="isNote">
      <p>Änderungen erfolgreich gespeichert: </p>

      <p v-html="note.html"></p>
    </div>

    <div class="success-buttons">
      <button @click="gotoLanding()">Weitere Änderungen vornehmen</button>
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
        'node',
        'isNote'
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
