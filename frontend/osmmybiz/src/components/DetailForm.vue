<template xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="form-wrapper">

    <div class="form-select">
      <basic-select :options="this.tags"
                    :selected-option="details.category"
                    placeholder="Kategorie auswählen"
                    @select="onSelect"
                    class="basic-select">
      </basic-select>
    </div>

    <div class="form-fields">
      <div class="column">
        <div class="field">
          <label>Name</label>
          <input type="text" v-model="details.name" placeholder="Your Name...">
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
          <input v-validate="'email'" :class="{'input': true, 'is-danger': errors.has('email') }" name="email"
                 type="text" v-model="details.email" placeholder="example@example.com">
          <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
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
      <button class="button" @click="submit()">Senden</button>
    </div>

  </div>

</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import {BasicSelect} from 'vue-search-select'
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'

  Vue.use(VeeValidate)

  export default {
    name: 'detail-form',
    computed: {
      ...mapGetters([
        'details',
        'tags'
      ])
    },
    methods: {
      ...mapActions([
        'postNote'
      ]),
      submit () {
        console.log(this.selected)
        this.postNote()
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

  input[type="text"], textarea, select {
    border: 2px solid #7ebc6f;
    padding: 12px 20px;
    display: inline-block;
    box-sizing: border-box;
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

  .basic-select, .basic-select:hover, .basic-select:focus {
    border: 2px solid #7ebc6f !important;
    margin-bottom: 12px !important;

  }

  .button {
    flex-grow: 1;
  }

  .menu {
    border: 2px solid #7ebc6f !important;
    border-top: none !important;
    margin: 0px -2px !important;
    min-width: calc(100% + 2px ) !important;
    width: calc(100% + 4px ) !important;
  }

</style>
