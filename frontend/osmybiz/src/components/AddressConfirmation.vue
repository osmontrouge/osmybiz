<template>

  <div class="address-wrapper">
    <div class="address-confirmation" v-if="!displayAddressForm">
      <p>Ihre Adresse wurde erfolgreich gefunden:</p>

      <div class="address-text" v-if="!isLoading">
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
        <button @click="gotoLanding()">Zurück</button>
        <button @click="displayAddressFormular()">Adresse ändern</button>
        <button @click="displayDetailForm()">Adresse speichern</button>
      </div>
    </div>

    <div class="form-fields" v-if="displayAddressForm">
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
        <label>Hausnummer</label>
        <input type="text"
               name="housenumber"
               v-model="address.housenumber"
               placeholder="50">
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
      <div class="form-footer">
        <div class="form-buttons">
          <button class="button"
                  @click="displayConfirm()">
            Zurück</button>
          <div class="button"></div>
          <button class="button"
                  :disabled="isRequiredFields()"
                  @click="displayDetailForm()">
            Speichern</button>
        </div>
        <span>Felder mit * sind obligatorisch</span>
      </div>
    </div>
  </div>

</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'

  Vue.use(VeeValidate)

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
        'isLoading',
        'displayAddressForm'
      ])
    },
    methods: {
      ...mapActions([
        'getAddress'
      ]),
      ...mapMutations([
        'setDisplayConfirmation',
        'setDisplayAddressForm'
      ]),
      gotoLanding () {
        this.$router.push('/')
      },
      displayDetailForm () {
        this.setDisplayConfirmation(false)
      },
      displayAddressFormular () {
        this.setDisplayAddressForm(true)
      },
      displayConfirm () {
        this.setDisplayAddressForm(false)
      },
      isRequiredFields () {
        return this.address.street === '' ||
          this.address.postcode === '' ||
          this.address.city === '' ||
          this.address.country === ''
      }
    }
  }
</script>

<style scoped>
  .address-wrapper {
    max-width:750px;
    margin: 20px auto 20px auto;
  }

  .address-text {
    margin-bottom: 10px;
  }

  .address-buttons {
    display: flex;
    flex-direction: row;
  }

  .address-buttons button {
    flex: 1 0;
    margin: 0 0 10px 10px;
  }

  button {
    margin: auto;
  }

  input[type="text"] {
    border: 2px solid #7ebc6f;
    padding: 12px 20px;
    display: inline-block;
    box-sizing: border-box;
    outline: none;
  }

  input::placeholder, textarea::placeholder {
    color: lightgrey;
  }

  .form-fields {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    align-items: stretch;
  }

  .form-footer {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
  }

  .form-footer span {
    margin-top: 10px;
  }
  .form-buttons {
    display: flex;
    flex-direction: row;
  }

  .button {
    flex-grow: 1;
  }

  .field {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    flex-grow: 1;
    padding-bottom: 12px;
  }

  .field label {
    text-align: left;
  }

  .field span {
    color: red;
  }

  span {
    text-align: left;
  }

  button:disabled {
    border: 2px solid darkgray;
    background-color: lightgrey;
    color: black;
  }
</style>
