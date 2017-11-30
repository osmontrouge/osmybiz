<template>
  <div>
    <h2>{{t('detail').title}}</h2>

    <category-field></category-field>
    <address-fields></address-fields>
    <detail-form></detail-form>
    <extra-info-fields></extra-info-fields>
    <form-footer></form-footer>

    <form-popup v-if="isPopup"></form-popup>

  </div>
</template>

<script>
  import DetailForm from '@/components/DetailForm'
  import PostSuccess from '@/components/PostSuccess'
  import AddressFields from '../components/AddressFields'
  import CategoryField from '../components/CategoryField'
  import FormPopup from '../components/FormPopup'
  import ExtraInfoFields from '../components/ExtraInfoFields'
  import FormFooter from '../components/FormFooter'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import * as _ from 'lodash'
  import {routes} from './../router'

  export default {
    mounted () {
      if (!_.isNumber(this.lat) || !_.isNumber(this.lon) || !this.isLoggedIn) {
        this.$router.push({name: routes.Landing})
      }
      this.setDisplaySuccess(false)

      this.getAddress()
      localStorage.setItem('details', JSON.stringify(this.details))
    },
    components: {
      FormPopup,
      FormFooter,
      DetailForm,
      PostSuccess,
      AddressFields,
      CategoryField,
      ExtraInfoFields
    },
    computed: {
      ...mapGetters([
        'lat',
        'lon',
        'details',
        'isLoggedIn',
        'isPopup',
        'address'
      ])
    },
    methods: {
      ...mapMutations([
        'setDisplaySuccess',
        'setDisplayConfirmation'
      ]),
      ...mapActions([
        'getAddress'
      ])
    }
  }
</script>

<style>
  h2 {
    text-align: left;
    margin: auto;
    max-width:750px;
  }
</style>
