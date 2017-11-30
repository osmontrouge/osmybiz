<template>
  <div class="form-footer">
    <button class="button"
            @click="back()">
      Zurück</button>
    <button class="button"
            @click="reset()">
      Zurücksetzen</button>
    <button class="button"
            v-if="isNote"
            :disabled="isRequiredFields()"
            @click="submitNote()">
      {{t('detail').save}}</button>
    <button class="button"
            v-if="!isNote"
            :disabled="isRequiredFields()"
            @click="submitNode()">
      {{t('detail').save}}</button>
  </div>
</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import {routes} from './../router'
  import {clearDetails} from './../store/detail'

  export default {
    name: 'form-footer',
    computed: {
      ...mapGetters([
        'isNote',
        'details'
      ])
    },
    methods: {
      ...mapMutations([
        'setDetails',
        'setAddress'
      ]),
      ...mapActions([
        'postNote',
        'postNode'
      ]),
      submitNote () {
        this.postNote()
        this.$router.push({name: routes.Landing})
        clearDetails()
      },
      submitNode () {
        this.postNode()
        this.$router.push({name: routes.Landing})
        clearDetails()
      },
      isRequiredFields () {
        return this.details.category.text === '' || this.details.name === ''
      },
      reset () {
        let details = JSON.parse(localStorage.getItem('details'))
        let address = JSON.parse(localStorage.getItem('address'))
        let category = {
          fields: details.category.fields,
          text: details.category.text,
          value: details.category.value
        }
        if (this.details.category.text === details.category.text) {
          this.details.category.fields.forEach(function (field, index) {
            category.fields[index].label = field.label
          })
        }
        details.category = category
        this.setDetails(details)
        this.setAddress(address)
      },
      back () {
        this.$router.push({name: routes.Landing})
      }
    }
  }
</script>

<style scoped>
  .form-footer {
    position: fixed;
    margin: auto;
    height: 50px;
    width: 100%;
    bottom: 0;
    background: white;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: flex-start;
  }

  button:disabled {
    border: 2px solid darkgray;
    background-color: lightgrey;
    color: black;
  }

  .button {
    flex-grow: 1;
    margin: 5px;
  }
</style>
