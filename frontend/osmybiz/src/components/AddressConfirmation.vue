<template>

  <div class="address-wrapper">
    <p>Ihre Adresse wurde erfolgreich gefunden und gespeichert:</p>

    <div v-if="!isLoading">
      <p>
      <span v-if="address.street">
      {{address.street}}
      </span>
        <span v-if="address.housenumber">
        {{' ' + address.housenumber}}
      </span>
      <p>
      <span v-if="address.postcode">
        {{address.postcode}}
      </span>
        <span v-if="address.city">
        {{' ' + address.city}}
      </span>
      </p>
      <p>
      <span v-if="address.country">
        {{address.country}}
      </span>
      </p>
    </div>

    <div v-if="isLoading">
      <img src="../assets/loading.gif">
    </div>

    <div class="address-buttons">
      <button @click="displayDetailForm()">Adresse ist richtig</button>
      <button @click="gotoLanding()">Adresse ändern</button>
    </div>
  </div>

</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    name: 'address-confirmation',
    mounted () {
      this.getAddress()
    },
    computed: {
      ...mapGetters([
        'lon',
        'lat',
        'address',
        'isLoading'
      ])
    },
    methods: {
      ...mapActions([
        'getAddress'
      ]),
      ...mapMutations([
        'setDisplayConfirmation'
      ]),
      gotoLanding () {
        this.$router.push('/')
      },
      displayDetailForm () {
        this.setDisplayConfirmation(false)
      }
    }
  }
</script>

<style scoped>
  .address-wrapper {
    max-width:750px;
    margin: 20px auto 20px auto;
  }

  .address-buttons {
    display: flex;
    flex-direction: row;
  }

  button {
    margin: auto;
  }
</style>
