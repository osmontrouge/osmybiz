<template>

  <div class="success-wrapper">
    <div class="node-success" v-if="!isNote">
      <div class="success-header">
        <h2>Neues Business erfolgreich erstellt: </h2>

        <a :href="node.link" target="_blank">Link zum Business</a>
      </div>

      <div class="success-container">
        <div class="success-labels">
          <p>Adresse:</p>
          <p>Name:</p>
          <p>Öffnungszeiten:</p>
          <p>Telefonnummer:</p>
          <p>E-Mail:</p>
          <p>Webseite:</p>
          <p>Rollstuhlgängig:</p>
          <p>Beschreibung:</p>
          <p>Notiz:</p>
        </div>

        <div class="success-text">
          <div class="address-text">
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
          </div>

          <div class="details-text">
            <span v-if="node.details.name">
              {{node.details.name}}
            </span>
            <span v-if="node.details.opening_hours">
              {{node.details.opening_hours}}
            </span>
            <span v-if="node.details.phone">
              {{node.details.phone}}
            </span>
            <span v-if="node.details.email">
              {{node.details.email}}
            </span>
            <span v-if="node.details.website">
              {{node.details.website}}
            </span>
            <span v-if="node.details.wheelchair">
              {{node.details.wheelchair}}
            </span>
            <span v-if="node.details.description">
              {{node.details.name}}
            </span>
            <span v-if="node.details.note">
              {{node.details.name}}
            </span>
          </div>
        </div>
      </div>
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
    text-align: left;
  }

  .success-header {
    display: flex;
    flex-direction: row;
  }

  a {
    font-size: large;
    margin-top: 8px;
    margin-left: 10px;
  }

  .success-container {
    display: flex;
    flex-direction: row;
  }

  .success-labels {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    font-weight: bold;
  }

  .success-text {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .success-buttons {
    margin-top: 10px;
  }

  .address-text {
    margin-bottom: 10px;
  }
</style>
