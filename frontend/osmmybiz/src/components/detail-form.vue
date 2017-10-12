<template>
  <div>
    <form>
      Kategorie:<br>
      <select type="text" v-model="details.category"></select><br>
      Name:<br>
      <input type="text" v-model="details.name"><br>
      Öffnungszeiten:<br>
      <input type="text" v-model="details.openinghours"><br>
      Telefonnummer:<br>
      <input type="text" v-model="details.phonenumber"><br>
      E-Mail:<br>
      <input type="text" v-model="details.email"><br>
      Webseite:<br>
      <input type="text" v-model="details.website"><br>
      Beschreibung:<br>
      <textarea type="text" v-model="details.description"></textarea><br>

      {{details}}

      <button @click="submit()">
        Business erfassen
      </button>
    </form>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: 'detail-form',
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
      }
    }
  }
</script>

<style scoped>
</style>
