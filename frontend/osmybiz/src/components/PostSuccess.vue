<template>

  <div class="success-wrapper" v-if="displaySuccess">
    <div class="node-success" v-if="!isNote">
      <div class="success-header">
        <h3>Neues Business erstellt </h3>
        <a :href="node.link" target="_blank">Link zu OpenStreetMap</a>
      </div>

      <div class="success-text">
          <p>
            <strong>Adresse:</strong>

            <span v-if="node.address.street">
              {{node.address.street}}
            </span>
            <span v-if="node.address.housenumber">
                {{' ' + node.address.housenumber}}
            </span>
            <span v-if="node.address.postcode">
                {{', ' +node.address.postcode}}
            </span>
            <span v-if="node.address.city">
                {{' ' + node.address.city}}
            </span>

            <strong>Name:</strong> {{node.details.name}}
          </p>
      </div>
    </div>

    <div class="note-success" v-if="isNote">
      <p>Änderungen gespeichert: </p>
      <p v-html="note.html"></p>
    </div>

    <div class="success-buttons">
      <button @click="toggleSuccess()">Ok</button>
    </div>
  </div>

</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'post-note-success',
    mounted () {

    },
    computed: {
      ...mapGetters([
        'note',
        'node',
        'isNote',
        'displaySuccess',
        'hasUpdates'
      ])
    },
    methods: {
      ...mapMutations([
        'setDisplaySuccess',
        'setDetails'
      ]),
      toggleSuccess () {
        this.setDisplaySuccess(false)
        this.hasUpdates = true
      }
    }
  }
</script>

<style scoped>
  .success-wrapper {
    position: fixed;
    z-index: 100;
    width: 500px;
    margin-left: -250px;
    bottom: 50px;
    left: 50%;
    background-color: white;
    border: 2px solid #7ebc6f;
    padding: 12px;
  }

  .success-header {
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    text-align: left;
    margin-bottom: 10px;
  }

  h3 {
    text-align: left;
    margin: 0;
  }

  a {
    margin-top: 2px;
    margin-left: 10px;
  }

  .success-text {
    text-align: left;
  }

  .success-buttons {
    margin-top: 10px;
    float: right;
  }
</style>
