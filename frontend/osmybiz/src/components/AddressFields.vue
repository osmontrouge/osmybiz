<template>

  <div class="address-wrapper">
    <h3>Adresse</h3>
    <div class="address-fields">
      <div class="column">
        <div class="field">
          <label>Strasse*</label>
          <input v-validate.initial="'required'"
                 :class="{'is-error': errors.has('street') }"
                 type="text"
                 name="street"
                 v-model="address.street"
                 placeholder="Dorfstrasse">

          <span v-show="errors.has('street')"
                class="help is-danger"> Die Strasse ist obligatorisch.
        </span>
        </div>
        <div class="field">
          <label>Postleitzahl*</label>
          <input v-validate.initial="'required'"
                 :class="{'is-error': errors.has('postcode') }"
                 type="text"
                 name="postcode"
                 v-model="address.postcode"
                 placeholder="8450">

          <span v-show="errors.has('postcode')"
                class="help is-danger"> Die Postleitzahl ist obligatorisch.
        </span>
        </div>
      </div>

      <div class="column">
        <div class="field">
          <label>Hausnummer</label>
          <input type="text"
                 name="housenumber"
                 v-model="address.housenumber"
                 placeholder="50">
        </div>
        <div class="field">
          <label>Ort*</label>
          <input v-validate.initial="'required'"
                 :class="{'is-error': errors.has('city') }"
                 type="text"
                 name="city"
                 v-model="address.city"
                 placeholder="Winterthur">

          <span v-show="errors.has('city')"
                class="help is-danger"> Der Ort ist obligatorisch.
        </span>
        </div>
      </div>
    </div>
    <div class="field">
      <label>Land*</label>
      <input v-validate.initial="'required'"
             :class="{'is-error': errors.has('country') }"
             type="text"
             name="country"
             v-model="address.country"
             placeholder="Schweiz">

      <span v-show="errors.has('country')"
            class="help is-danger"> Das Land ist obligatorisch.
        </span>
    </div>
  </div>

</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'

  Vue.use(VeeValidate)

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
    max-width:750px;
    margin: 0 auto;
  }

  .address-fields {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: stretch;
  }

  .column {
    width: 47%;
    display: flex;
    flex-direction: column;
    align-items:stretch;
  }

  .field {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    flex-grow: 1;
    padding-bottom: 12px;
  }
</style>
