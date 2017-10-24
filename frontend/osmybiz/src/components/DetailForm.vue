<template xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="form-wrapper">

    <div class="form-select">
      <div class="field">
        <label>Kategorie*</label>

        <basic-select v-show="!isOwnCategory"
                      :options="this.tags"
                      :selected-option="details.category"
                      placeholder="Kategorie auswählen"
                      @select="onSelect"
                      class="basic-select">
        </basic-select>

        <div v-show="isOwnCategory" class="ownCategory-field">
          <input v-validate.initial="'required'"
                 v-model="details.category.text"
                 type="text"
                 name="category-input"/>
          <button class="button" @click="hideInput()">
            Select Category
          </button>
        </div>

        <span v-show="details.category.text === ''"
              class="help is-danger"> Das Kategoriefeld ist obligatorisch.
        </span>
      </div>
    </div>

    <div class="form-fields">
      <div class="column">
        <div class="field">
          <label>Name*</label>
          <input v-validate.initial="'required'"
                 :class="{'is-error': errors.has('first_name') }"
                 type="text"
                 name="name"
                 v-model="details.name"
                 placeholder="Your Name...">
          <span v-show="errors.has('name')"
                class="help is-danger"> Das Namensfeld ist obligatorisch.
          </span>
        </div>
        <div class="field">
          <label>Öffnungszeiten</label>
          <input type="text" v-model="details.openinghours" placeholder="Mo-Fr 08:00-17:00">
        </div>
        <div class="field">
          <label>Telefonnummer</label>
          <input type="text" v-model="details.phonenumber" placeholder="+41 11 111 11 11">
        </div>
        <div class="field" :class="{ 'control': true }">
          <label>E-Mail</label>
          <input v-validate="'email'"
                 :class="{'is-error': errors.has('email') }"
                 name="email"
                 type="text"
                 v-model="details.email"
                 placeholder="example@example.com">
          <span v-show="errors.has('email')"
                class="help is-danger">Das Emailfeld muss eine valide Emailadresse enthalten.
          </span>
        </div>
        <div class="field">
          <label>Webseite</label>
          <input type="text" v-model="details.website" placeholder="example.com">
        </div>
        <div class="field">
          <label>Rollstuhlgängig</label>
          <input class="checkbox" type="checkbox" v-model="details.wheelchair">
        </div>
      </div>

      <div class="column">
        <div class="field">
          <label>Beschreibung</label>
          <textarea class="area" v-model="details.description" placeholder="Beschreibung"></textarea>
        </div>

        <div class="field">
          <label>Notiz</label>
          <textarea class="area" v-model="details.note" placeholder="Notiz"></textarea>
        </div>

      </div>
    </div>

    <div class="form-footer">
      <button class="button"
              :disabled="isRequiredFields()"
              @click="submit()">Senden</button>
      <span>Felder mit * sind obligatorisch</span>
    </div>


  </div>

</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import {BasicSelect} from 'vue-search-select'
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'

  Vue.use(VeeValidate)

  export default {
    name: 'detail-form',
    computed: {
      ...mapGetters([
        'details',
        'tags',
        'isOwnCategory'
      ])
    },
    methods: {
      ...mapMutations([
        'setIsOwnCategory'
      ]),
      ...mapActions([
        'postNote'
      ]),
      submit () {
        this.postNote()
      },
      hideInput () {
        this.setIsOwnCategory(false)
        this.details.category = {value: 0, text: ''}
      },
      isRequiredFields () {
        return this.details.category.text === '' || this.details.name === ''
      },
      onSelect (item) {
        console.log(item.text)
        if (item.text === 'Eigene Kategorie wählen') {
          console.log('test')
          this.setIsOwnCategory(true)
          this.details.category = {value: 0, text: ''}
        } else {
          this.details.category = item
        }
      }
    },
    components: {
      BasicSelect
    }
  }
</script>

<style>

  input[type="text"], textarea, select {
    border: 2px solid #7ebc6f;
    padding: 12px 20px;
    display: inline-block;
    box-sizing: border-box;
    outline: none;
  }

  .area {
    flex-grow: 1;
  }

  .checkbox {
    height: 44px;
    width: 24px;
  }

  textarea {
    resize: none;
  }

  .form-wrapper {
    max-width:750px;
    margin: auto;

  }

  .form-fields {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: stretch;
  }

  .column {
    width: 45%;
    display: flex;
    flex-direction: column;
    align-items:stretch;
    justify-content: space-around;
  }

  .form-footer {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
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

  .ownCategory-field {
    display: flex;
    flex-direction: row;
  }

  .ownCategory-field input{
    flex-grow: 5;
  }

  .ownCategory-field button{
    flex-grow: 1;
    margin-left: 10px;
  }

  .basic-select, .basic-select:hover, .basic-select:focus {
    border: 2px solid #7ebc6f !important;
    margin-bottom: 12px !important;

  }

  .button {
    flex-grow: 1;
  }

  button:disabled {
    border: 2px solid darkgray;
    background-color: lightgrey;
    color: white;
  }

  .menu {
    border: 2px solid #7ebc6f !important;
    border-top: none !important;
    margin: 0px -2px !important;
    min-width: calc(100% + 2px ) !important;
    width: calc(100% + 4px ) !important;
  }

</style>
