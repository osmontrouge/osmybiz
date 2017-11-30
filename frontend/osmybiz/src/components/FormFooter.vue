<template>
  <div class="form-footer">
    <button class="button"
            @click="reset()">
      Zurücksetzen</button>
    <button class="button"
            v-if="isNote"
            :disabled="isRequiredFields()"
            @click="submitNote()">
      {{t('save')}}</button>
    <button class="button"
            v-if="!isNote"
            :disabled="isRequiredFields()"
            @click="submitNode()">
      {{t('save')}}</button>
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
          text: this.details.category.text,
          value: this.details.category.value
        }
        this.details.category.fields.forEach(function (field, index) {
          category.fields[index].label = field.label
        })
        details.category = category
        this.setDetails(details)
        this.setAddress(address)
      }
    }
  }
</script>

<style scoped>
  .form-footer {
    max-width:750px;
    margin: auto;
    margin-bottom: 50px;
    display: flex;
    flex-direction: column;
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
    margin-top: 5px;
  }
</style>
