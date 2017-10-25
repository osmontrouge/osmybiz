<template>

  <div>
    <p>Ihre Adresse wurde erfolgreich gefunden und gespeichert: ({{lat}} / {{lon}})</p>

    {{address}}
    <p v-if="address.pedestrian">
      {{address.pedestrian}}
      <span v-if="address.house_number">
        {{' ' + address.house_number}}
      </span>
    </p>
    <p v-if="address.road">
      {{address.road}}
      <span v-if="address.house_number">
        {{' ' + address.house_number}}
      </span>
    </p>
    <p>
      {{address.postcode}}
      <span v-if="address.city">
        {{' ' + address.city}}
      </span>
      <span v-if="address.village">
        {{' ' + address.village}}
      </span>
    </p>
    <p>{{address.country}}</p>

    <button @click="gotoLanding()">Addresse ändern</button>
  </div>

</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: 'address-confirmation',
    mounted () {
      this.getAddress()
    },
    computed: {
      ...mapGetters([
        'lon',
        'lat',
        'address'
      ])
    },
    methods: {
      ...mapActions([
        'getAddress'
      ]),
      gotoLanding () {
        this.$router.push('/')
      }
    }
  }
</script>

<style scoped>

</style>
