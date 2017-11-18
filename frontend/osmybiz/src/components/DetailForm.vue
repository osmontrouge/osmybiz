<template>

  <div class="form-wrapper">

    <h2>Geschäft erfassen</h2>

    <div class="popup" v-if="isPopup">
        <span>{{infoText}}</span>
    </div>

    <div class="form-select">
      <div class="field">
        <div class="field-label">
          <label>Kategorie*</label>
          <img id="info-category"
               @mouseenter="showPopup('category')"
               @mouseleave="hidePopup()"
               src="../assets/info_black.png">
        </div>

        <div v-show="!isOwnCategory" class="Category-field">
          <basic-select v-show="!isOwnCategory"
                        :options="this.tags"
                        :selected-option="details.category"
                        placeholder="Kategorie auswählen"
                        @select="onSelect"
                        class="basic-select">
          </basic-select>

          <button class="button" @click="showInput()">
            Eigene Kategorie
          </button>
        </div>


        <div v-show="isOwnCategory" class="Category-field">
          <input v-validate.initial="'required'"
                 v-model="details.category.text"
                 type="text"
                 placeholder="Kategorie auswählen"
                 name="category-input"/>
          <button class="button" @click="hideInput()">
            Kategorie wählen
          </button>
        </div>

        <span v-show="details.category.text === ''"
              class="help is-danger"> Dies ist ein Pflichtfeld.
        </span>
      </div>
    </div>

    <div class="form-fields">
      <div class="column">
        <div class="field">
          <div class="field-label">
            <label>Name*</label>
            <img class="info"
                 @mouseenter="showPopup('name')"
                 @mouseleave="hidePopup()"
                 src="../assets/info_black.png">
          </div>

          <input v-validate.initial="'required'"
                 :class="{'is-error': errors.has('name') }"
                 type="text"
                 name="name"
                 v-model="details.name"
                 placeholder="Your Name...">

          <span v-show="errors.has('name')"
                class="help is-danger">
            Dies ist ein Pflichtfeld
          </span>
        </div>

        <div class="field">
          <div class="field-label">
            <label>Öffnungszeiten</label>
            <img class="info"
                 @mouseenter="showPopup('openinghours')"
                 @mouseleave="hidePopup()"
                 src="../assets/info_black.png">
          </div>

          <input type="text"
                 v-model="details.openinghours"
                 placeholder="Mo-Fr 08:00-17:00">
        </div>

        <div class="field">
          <div class="field-label">
            <label>Telefonnummer</label>
            <img class="info"
                 @mouseenter="showPopup('phonenumber')"
                 @mouseleave="hidePopup()"
                 src="../assets/info_black.png">
          </div>
          <input type="text"
                 v-model="details.phonenumber"
                 placeholder="+41 11 111 11 11">
        </div>

        <div class="field" :class="{ 'control': true }">
          <div class="field-label">
            <label>E-Mail</label>
            <img class="info"
                 @mouseenter="showPopup('email')"
                 @mouseleave="hidePopup()"
                 src="../assets/info_black.png">
          </div>

          <input v-validate="'email'"
                 :class="{'is-error': errors.has('email') }"
                 name="email"
                 type="text"
                 v-model="details.email"
                 placeholder="example@example.com">

          <span v-show="errors.has('email')"
                class="help is-danger">
            Emailadresse ist nicht valid.
          </span>
        </div>

        <div class="field">
          <div class="field-label">
            <label>Webseite</label>
            <img class="info"
                 @mouseenter="showPopup('website')"
                 @mouseleave="hidePopup()"
                 src="../assets/info_black.png">
          </div>

          <input v-validate="'url'"
                 type="text"
                 name="website"
                 v-model="details.website"
                 placeholder="http://www.example.com">

          <span v-show="errors.has('website')"
                class="help is-danger">
            Webseite ist nicht valid.
          </span>
        </div>

        <div class="field">
          <div class="field-label">
            <label>Rollstuhlgängig</label>
            <img class="info"
                 @mouseenter="showPopup('wheelchair')"
                 @mouseleave="hidePopup()"
                 src="../assets/info_black.png">
          </div>

          <div class="checkboxes">
            <div class="checkbox-wrapper">
              <input class="checkbox"
                     type="radio"
                     id="one"
                     value="Ja"
                     v-model="details.wheelchair">
              <label>Ja</label>
            </div>
            <div class="checkbox-wrapper">
              <input class="checkbox"
                     type="radio"
                     id="two"
                     value="Eingeschränkt"
                     v-model="details.wheelchair">
              <label>Eingeschränkt</label>
            </div>
            <div class="checkbox-wrapper">
              <input class="checkbox"
                     type="radio"
                     id="three"
                     value="Nein"
                     v-model="details.wheelchair">
              <label>Nein</label>
            </div>
          </div>
        </div>
      </div>

      <div class="column">
        <div class="field">
          <div class="field-label">
            <label>Beschreibung des Geschäfts</label>
            <img class="info"
                 @mouseenter="showPopup('description')"
                 @mouseleave="hidePopup()"
                 src="../assets/info_black.png">
          </div>

          <textarea class="area" v-model="details.description" placeholder="Beschreibung"></textarea>
        </div>

        <div class="field">
          <div class="field-label">
            <label>Notiz für eintragende Person</label>
            <img class="info"
                 @mouseenter="showPopup('note')"
                 @mouseleave="hidePopup()"
                 src="../assets/info_black.png">
          </div>

          <textarea class="area" v-model="details.note" placeholder="Notiz"></textarea>
        </div>
      </div>
    </div>

    <h5>Felder mit * sind Pflichtfelder</h5>

    <div class="extra-wrapper" v-if="details.category.fields && details.category.fields.length > 0 && details.category.fields[0].name !== ''">
      <h3>Zusatzinformationen:</h3>
      <div class="extra-fields">
        <div class="column">
          <div class="field"
               v-for="field in details.category.fields.slice(details.category.fields.length/2, details.category.fields.length)">
            <label>{{ field.name }}</label>
            <input type="text" v-model="field.value">
          </div>
        </div>
        <div class="column">
          <div class="field"
               v-for="field in details.category.fields.slice(0, details.category.fields.length/2)">
            <label>{{ field.name }}</label>
            <input type="text" v-model="field.value">
          </div>
        </div>
      </div>
    </div>

    <div class="form-footer">
      <button class="button"
              v-if="!isComment"
              :disabled="isRequiredFields()"
              @click="submitNote()">
        Speichern</button>
      <button class="button"
              v-if="isComment"
              :disabled="isRequiredFields()"
              @click="submitComment()">
        Speichern</button>
      <button class="button"
              @click="submitNode()">
        Create Node</button>
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
        'isOwnCategory',
        'isPopup',
        'isComment',
        'infoText',
        'infoMap'
      ])
    },
    methods: {
      ...mapMutations([
        'setIsOwnCategory',
        'setIsPopup',
        'setInfoText',
        'setDetails'
      ]),
      ...mapActions([
        'postNote',
        'postComment',
        'postNode'
      ]),
      submitNote () {
        this.postNote()
      },
      submitComment () {
        this.postComment()
      },
      submitNode () {
        this.postNode()
      },
      hideInput () {
        this.setIsOwnCategory(false)
        this.details.category = {value: 0, text: ''}
      },
      showInput () {
        this.setIsOwnCategory(true)
        this.details.category = {value: 0, text: ''}
      },
      isRequiredFields () {
        return this.details.category.text === '' || this.details.name === ''
      },
      showPopup (key) {
        this.setInfoText(this.infoMap.get(key))
        this.setIsPopup(true)
      },
      hidePopup () {
        this.setIsPopup(false)
      },
      onSelect (item) {
        this.details.category = item
      }
    },
    components: {
      BasicSelect
    }
  }
</script>

<style>
  input[type="text"], textarea {
    border: 2px solid #7ebc6f;
    padding: 12px 20px;
    display: inline-block;
    box-sizing: border-box;
    outline: none;
  }

  input::placeholder, textarea::placeholder {
    color: lightgrey;
  }

  .area {
    flex-grow: 1;
  }

  .checkboxes {
    display: flex;
    flex-direction: row;
  }

  .checkbox-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
  }

  .checkbox {
    height: 44px;
    width: 24px;
  }

  textarea {
    resize: none;
  }

  h2, h3, h5 {
    text-align: left;
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

  .extra-wrapper {
    border-top: 1px solid #7ebc6f;
  }

  .extra-wrapper h3 {
    margin-top: 10px;
  }

  .extra-fields {
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
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

  button:disabled {
    border: 2px solid darkgray;
    background-color: lightgrey;
    color: black;
  }

  .Category-field {
    display: flex;
    flex-direction: row;
  }

  .Category-field input, .basic-select{
    flex-grow: 5 !important;
  }

  .Category-field button{
    flex: 0 0;
    flex-basis: auto;
    margin-left: 10px;
  }

  .basic-select, .basic-select:hover, .basic-select:focus {
    border: 2px solid #7ebc6f !important;
  }

  .button {
    flex-grow: 1;
  }

  img{
    width: 4%;
    height: 4%;
    margin-left: 5px;
  }

  #info-category {
    width: 2%;
    height: 2%;
    margin-left: 5px;
  }

  .field-label {
    display: flex;
    flex-direction: row;
  }

  .popup {
    background: #7ebc6f;
    display: block;
    position: absolute;
    margin: 0 auto;
    top: 35%;
    left: 0;
    right: 0;
    width: 300px;
    z-index: 100;
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
