<template>

  <div class="form-wrapper">

    <h3>Details</h3>

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

  </div>

</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'

  Vue.use(VeeValidate)

  export default {
    name: 'detail-form',
    computed: {
      ...mapGetters([
        'details',
        'address',
        'tags',
        'isOwnCategory',
        'infoMap'
      ])
    },
    methods: {
      ...mapMutations([
        'setIsOwnCategory',
        'setIsPopup',
        'setInfoText'
      ]),
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
    }
  }
</script>

<style>
  .form-wrapper {
    margin: 0 10% 10px;
    width: 80%;
  }

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

  h3, h5 {
    text-align: left;
  }

  .form-fields {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: stretch;
  }

  .column {
    width: 49%;
    display: flex;
    flex-direction: column;
    align-items:stretch;
    justify-content: space-around;
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

  .field-label {
    display: flex;
    flex-direction: row;
  }

</style>
