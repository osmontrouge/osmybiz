<template>

  <div class="address-wrapper">
    <h3>Adresse</h3>
    <div class="address-fields">
      <div class="row">
        <div class="left-field">
          <label>Strasse*</label>
          <input type="text"
                 name="street"
                 v-model="address.street"
                 placeholder="Dorfstrasse">

          <span v-show="address.street === ''"
                class="help is-danger"> Die Strasse ist obligatorisch.
          </span>
        </div>

        <div class="middle"></div>

        <div class="right-field">
          <label>Hausnummer</label>
          <input type="text"
                 name="housenumber"
                 v-model="address.housenumber"
                 placeholder="50">
        </div>
      </div>

      <div class="row">
        <div class="left-field">
          <label>Postleitzahl*</label>
          <input type="text"
                 name="postcode"
                 v-model="address.postcode"
                 placeholder="8450">

          <span v-show="address.postcode === ''"
                class="help is-danger"> Die Postleitzahl ist obligatorisch.
          </span>
        </div>

        <div class="middle"></div>

        <div class="right-field">
          <label>Ort*</label>
          <input type="text"
                 name="city"
                 v-model="address.city"
                 placeholder="Winterthur">

          <span v-show="address.city === ''"
                class="help is-danger"> Der Ort ist obligatorisch.
          </span>
        </div>
      </div>
    </div>
    <div class="field">
      <label>Land*</label>
      <input type="text"
             name="country"
             v-model="address.country"
             placeholder="Schweiz">

      <span v-show="address.country === ''"
            class="help is-danger"> Das Land ist obligatorisch.
        </span>
    </div>
  </div>

</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: 'address-fields',
    mounted () {
      this.getAddress()
    },
    computed: {
      ...mapGetters([
        'address'
      ])
    },
    methods: {
      ...mapActions([
        'getAddress'
      ])
    }
  }
</script>

<style scoped>
  .address-wrapper {
    max-width: 750px;
    margin: 0 auto;
  }

  .address-fields {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    align-items: stretch;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }

  .left-field {
    display: flex;
    flex-direction: column;
    padding-bottom: 12px;
    flex-grow: 1;
  }

  .right-field {
    display: flex;
    flex-direction: column;
    padding-bottom: 12px;
    flex-grow: 1;
  }

  .middle {
    flex-basis: 6%;
  }

  .field {
    display: flex;
    flex-direction: column;
    padding-bottom: 12px;
  }
</style>
