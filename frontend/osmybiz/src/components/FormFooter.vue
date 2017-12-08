<template>
  <div class="form-footer">
    <button class="button"
            @click="back()">
      Zurück</button>
    <button class="button"
            id="reset-button"
            @click="reset()">
      Zurücksetzen</button>
    <button class="button"
            :disabled="isRequiredFields() || isDuplicate"
            @click="submit()">
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
        'details',
        'user',
        'osmId',
        'lat',
        'lon',
        'isDuplicate'
      ])
    },
    methods: {
      ...mapMutations([
        'setDetails',
        'setAddress',
        'setIsDuplicate',
        'setIsConfirm'
      ]),
      ...mapActions([
        'postNote',
        'postNode',
        'checkDuplicateNode',
        'getConfirmation',
        'loadUpdates'
      ]),
      submit () {
        let promise
        if (this.isNote) {
          promise = this.postNote({user: this.user, osmId: this.osmId})
        } else {
          promise = this.checkDuplicateNode().then((res) => {
            if (!res) {
              return this.postNode(this.user)
            }
          })
        }
        promise.then(() => {
          this.loadUpdates(this.user)
          this.$router.push({name: routes.Landing})
          clearDetails()
        })
      },
      isRequiredFields () {
        return this.details.category.text === '' || this.details.name === ''
      },
      reset () {
        this.getConfirmation(() => {
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
          this.setIsConfirm(false)
        })
      },
      back () {
        this.getConfirmation(() => {
          this.$router.push({name: routes.Landing})
          this.setIsConfirm(false)
        })
      }
    }
  }
</script>

<style scoped>
  .form-footer {
    position: fixed;
    height: 60px;
    margin: 0 10% 0;
    width: 80%;
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
    margin: 10px 0;
  }

  #reset-button {
    margin: 10px;
  }
</style>
