<template>
  <div>
    <form class="form">
      <div class="field">
        <label>Kategorie</label>
        <basic-select class="select-category"
                      :options="this.tags.presets.item"
                      :selected-option="details.category"
                      placeholder="select category"
                      @select="onSelect">
        </basic-select>
      </div>
      <div class="right field">
        <div class="field">
          <div class="field">
            <label>Name</label>
            <input type="text" v-model="details.name" placeholder="Name">
          </div>
          <div class="field">
            <label>Öffnungszeiten</label>
            <input type="text" v-model="details.openinghours" placeholder="Öffnungszeiten">
          </div>
          <div class="field">
            <label>Telefonnummer</label>
            <input type="text" v-model="details.phonenumber" placeholder="Telefonnummer">
          </div>
          <div class="field" :class="{ 'control': true }">
            <label>E-Mail</label>
            <input v-validate="'email'" :class="{'input': true, 'is-danger': errors.has('email') }" name="email" type="text" v-model="details.email" placeholder="E-Mail">
            <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
          </div>
          <div class="field">
            <label>Webseite</label>
            <input type="text" v-model="details.website" placeholder="Webseite">
          </div>
          <div class="field">
            <input type="checkbox" v-model="details.wheelchair">
            <label>Rollstuhlgängig</label>
          </div>
        </div>
        <div class="left field">
          <div class="field">
            <label>Beschreibung</label>
            <textarea v-model="details.description" placeholder="Beschreibung"></textarea>
          </div>
        </div>
      </div>
      <button class="button" @click="submit()">Business erfassen</button>
    </form>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import tags from '../assets/tags.json'
  import { BasicSelect } from 'vue-search-select'
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
  .select-category {

  }
</style>
