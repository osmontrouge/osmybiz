<template>

  <div>
    <div>

      <input v-model="addressQuery">

      <button @click="searchAddress()">
        Search
      </button>

    </div>
    <div>

      Class: {{ address.class }} <br>
      Name: {{ address.display_name }} <br>
      Lat: {{ address.lat }} <br>
      Lon: {{ address.lon }} <br>
      OSMID: {{ address.osm_id }} <br>

    </div>

  </div>

</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {

    mounted () {
    },
    computed: {
      ...mapGetters([
        'address',
        'query'
      ]),
      addressQuery: {
        get () { return this.query },
        set (value) { this.setQuery(value) }
      }
    },
    methods: {
      ...mapActions([
        'loadFromNominatim'
      ]),
      ...mapMutations([
        'setQuery'
      ]),
      searchAddress () {
        this.loadFromNominatim()
      }
    }
  }
</script>

<style>

</style>
