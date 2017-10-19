<template>

  <div class="form-wrapper">

    <div class="form-header">
      <h1>
        Business erfassen
        <span>Bitte füllen sie die Felder aus. (Felder mit * sind obligatorisch)</span>
      </h1>
    </div>

    <div class="form-select">
      <basic-select :options="this.tags"
                    :selected-option="details.category"
                    placeholder="Kategorie auswählen"
                    @select="onSelect"
                    class=".basic-select">
      </basic-select>
    </div>

    <div class="form-fields">
      <div class="left-field">
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
          <input type="checkbox" v-model="details.wheelchair">
          <label>Rollstuhlgängig</label>
        </div>
      </div>

      <div class="right-field">
        <div class="field">
          <label>Beschreibung</label>
          <textarea v-model="details.description" placeholder="Beschreibung"></textarea>
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
  import tags from '../assets/tags_de.json'
  import {BasicSelect} from 'vue-search-select'
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'

  Vue.use(VeeValidate)

  export default {
    name: 'detail-form',
    data: function () {
      return {
        tags
      }
    },
    computed: {
      ...mapGetters([
        'details'
      ])
    },
    methods: {
      ...mapActions([
        'postNote'
      ]),
      submit () {
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

<style scoped>

  input[type="text"], textarea {
    border: 2px solid #7ebc6f;
    width: 100%;
    padding: 12px 20px;
    margin: 0 0 8px 5px;
    display: inline-block;
    border-radius: 4px;
    box-sizing: border-box;
  }

  input:hover, textarea:hover {
    background-color: #7ebc6f;
    color: white;
  }

  label {
    margin: 0 0 0 5px;
  }

  textarea {
    resize: none;
  }

  .form-wrapper {
  }

  .form-header {
  }

  .form-select {
    margin-left: 5px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 2px solid #7ebc6f;
  }

  .form-fields {
    display: flex;
    flex-flow: row;
  }

  .left-field {
    flex: 1 1;
  }

  .right-field {
    flex: 1 1;
    align-self: stretch;
    margin-left: 5px;
  }

  .form-footer {
  }

  .field {
    display: block;
  }

  .field label {
    float: left;
  }

</style>
