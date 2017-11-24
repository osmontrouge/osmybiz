<template>

  <div class="form-wrapper">

    <h2>{{t('detail').title}}</h2>

    <div class="popup" v-if="isPopup">
        <span>{{infoText}}</span>
    </div>

    <div class="form-select">
      <div class="field">
        <div class="field-label">
          <label>{{t('detail').labels.category}}*</label>
          <img id="info-category"
               @mouseenter="showPopup('category')"
               @mouseleave="hidePopup()"
               src="../assets/info_black.png">
        </div>

        <div v-show="!isOwnCategory" class="Category-field">
          <basic-select v-show="!isOwnCategory"
                        :options="this.tags"
                        :selected-option="details.category"
                        :placeholder="t('detail').placeholders.category"
                        @select="onSelect"
                        class="basic-select">
          </basic-select>

          <button class="button" @click="showInput()">
            {{t('detail').owncategory}}
          </button>
        </div>


        <div v-show="isOwnCategory" class="Category-field">
          <input v-model="details.category.text"
                 type="text"
                 :placeholder="t('detail').placeholders.owncategory"
                 name="category-input"/>
          <button class="button" @click="hideInput()">
            {{t('detail').choosecategory}}
          </button>
        </div>

        <span v-show="details.category.text === ''"
              class="help is-danger">
          {{t('detail').validate.required}}
        </span>
      </div>
    </div>

    <div class="form-fields">
      <div class="column">
        <div class="field">
          <div class="field-label">
            <label>{{t('detail').labels.name}}*</label>
            <img class="info"
                 @mouseenter="showPopup('name')"
                 @mouseleave="hidePopup()"
                 src="../assets/info_black.png">
          </div>

          <input type="text"
                 name="name"
                 v-model="details.name"
                 :placeholder="t('detail').placeholders.name">

          <span v-show="details.name === ''"
                class="help is-danger">
            {{t('detail').validate.required}}
          </span>
        </div>

        <div class="field">
          <div class="field-label">
            <label>{{t('detail').labels.opening_hours}}</label>
            <img class="info"
                 @mouseenter="showPopup('opening_hours')"
                 @mouseleave="hidePopup()"
                 src="../assets/info_black.png">
          </div>

          <input type="text"
                 v-model="details.opening_hours"
                 :placeholder="t('detail').placeholders.opening_hours">
        </div>

        <div class="field">
          <div class="field-label">
            <label>{{t('detail').labels.phone}}</label>
            <img class="info"
                 @mouseenter="showPopup('phone')"
                 @mouseleave="hidePopup()"
                 src="../assets/info_black.png">
          </div>
          <input type="text"
                 v-model="details.phone"
                 :placeholder="t('detail').placeholders.phone">
        </div>

        <div class="field" :class="{ 'control': true }">
          <div class="field-label">
            <label>{{t('detail').labels.email}}</label>
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
                 :placeholder="t('detail').placeholders.email">

          <span v-show="errors.has('email')"
                class="help is-danger">
            {{t('detail').validate.email}}
          </span>
        </div>

        <div class="field">
          <div class="field-label">
            <label>{{t('detail').labels.website}}</label>
            <img class="info"
                 @mouseenter="showPopup('website')"
                 @mouseleave="hidePopup()"
                 src="../assets/info_black.png">
          </div>

          <input v-validate="'url'"
                 type="text"
                 name="website"
                 v-model="details.website"
                 :placeholder="t('detail').placeholders.website">

          <span v-show="errors.has('website')"
                class="help is-danger">
            {{t('detail').validate.website}}
          </span>
        </div>

        <div class="field">
          <div class="field-label">
            <label>{{t('detail').labels.wheelchair}}</label>
            <img class="info"
                 @mouseenter="showPopup('wheelchair')"
                 @mouseleave="hidePopup()"
                 src="../assets/info_black.png">
          </div>

          <div class="checkboxes">
            <div class="checkbox-wrapper">
              <input class="radiobutton"
                     type="radio"
                     id="one"
                     value="yes"
                     v-model="details.wheelchair">
              <label>{{t('detail').labels.yes}}</label>
            </div>
            <div class="checkbox-wrapper">
              <input class="radiobutton"
                     type="radio"
                     id="two"
                     value="limited"
                     v-model="details.wheelchair">
              <label>{{t('detail').labels.limited}}</label>
            </div>
            <div class="checkbox-wrapper">
              <input class="radiobutton"
                     type="radio"
                     id="three"
                     value="no"
                     v-model="details.wheelchair">
              <label>{{t('detail').labels.no}}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="column">
        <div class="field">
          <div class="field-label">
            <label>{{t('detail').labels.description}}</label>
            <img class="info"
                 @mouseenter="showPopup('description')"
                 @mouseleave="hidePopup()"
                 src="../assets/info_black.png">
          </div>

          <textarea class="area"
                    v-model="details.description"
                    :placeholder="t('detail').placeholders.description"></textarea>
        </div>

        <div class="field">
          <div class="field-label">
            <label>{{t('detail').labels.note}}</label>
            <img class="info"
                 @mouseenter="showPopup('note')"
                 @mouseleave="hidePopup()"
                 src="../assets/info_black.png">
          </div>

          <textarea class="area"
                    v-model="details.note"
                    :placeholder="t('detail').placeholders.note"></textarea>
        </div>
      </div>
    </div>

    <h5>{{t('detail').validate.subtitle}}</h5>

    <div class="extra-wrapper" v-if="details.category.fields && details.category.fields.length > 0 && details.category.fields[0].name !== ''">
      <h3>{{t('detail').subtitle}}</h3>
      <div class="extra-fields">
        <div class="column">
          <div class="field"
               v-for="field in details.category.fields.slice(details.category.fields.length/2, details.category.fields.length)">
            <label>{{ field.label }}</label>
            <extra-input-field :field="field"></extra-input-field>
          </div>
        </div>
        <div class="column">
          <div class="field"
               v-for="field in details.category.fields.slice(0, details.category.fields.length/2)">
            <label>{{ field.label }}</label>
            <extra-input-field :field="field"></extra-input-field>
          </div>
        </div>
      </div>
    </div>

    <div class="form-footer">
      <button class="button"
              @click="reset()">
        Zurücksetzen</button>
      <button class="button"
              v-if="isNote"
              :disabled="isRequiredFields()"
              @click="submitNote()">
        {{t('save')}}</button>
      <!--
      <button class="button"
              v-if="isComment"
              :disabled="isRequiredFields()"
              @click="submitComment()">
        Speichern</button>
        -->
      <button class="button"
              v-if="!isNote"
              :disabled="isRequiredFields()"
              @click="submitNode()">
        {{t('save')}}</button>
    </div>
  </div>

</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import {BasicSelect} from 'vue-search-select'
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'
  import ExtraInputField from '../components/ExtraInputField'

  Vue.use(VeeValidate)

  export default {
    name: 'detail-form',
    created () {
      localStorage.setItem('details', JSON.stringify(this.details))
    },
    computed: {
      ...mapGetters([
        'details',
        'tags',
        'isOwnCategory',
        'isPopup',
        'isNote',
        'infoText',
        'infoMap',
        'temp'
      ])
    },
    methods: {
      ...mapMutations([
        'setIsOwnCategory',
        'setIsPopup',
        'setInfoText',
        'setDetails',
        'saveTemp'
      ]),
      ...mapActions([
        'postNote',
        'postComment',
        'postNode'
      ]),
      submitNote () {
        this.postNote()
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
      reset () {
        let details = JSON.parse(localStorage.getItem('details'))
        let category = {
          fields: details.category.fields,
          text: this.details.category.text,
          value: this.details.category.value
        }
        console.log(category)
        this.details.category.fields.forEach(function (field, index) {
          category.fields[index].label = field.label
        })
        details.category = category
        this.setDetails(details)
      },
      onSelect (item) {
        this.details.category = item
      }
    },
    components: {
      BasicSelect,
      ExtraInputField
    }
  }
</script>

<style>
  input[type="text"], input[type="number"], textarea, select {
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

  .checkbox, .radiobutton {
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
    margin-bottom: 50px;
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
    margin: auto auto auto 10px;
  }

  .basic-select, .basic-select:hover, .basic-select:focus {
    border: 2px solid #7ebc6f !important;
  }

  .button {
    flex-grow: 1;
    margin-top: 5px;
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
