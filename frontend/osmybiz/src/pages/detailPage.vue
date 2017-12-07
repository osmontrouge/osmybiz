<template>
  <div class="detail-wrapper">

    <div>
      <h2>{{t('detail').title}}</h2>

      <category-field></category-field>
      <address-fields></address-fields>
      <detail-form></detail-form>
      <extra-info-fields></extra-info-fields>
    </div>

    <duplicate-warning></duplicate-warning>
    <confirm-warning></confirm-warning>

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
  import DuplicateWarning from '../components/DuplicateWarning'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import * as _ from 'lodash'
  import {routes} from './../router'
  import ConfirmWarning from '../components/ConfirmWarning'

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
      ConfirmWarning,
      FormPopup,
      FormFooter,
      DetailForm,
      PostSuccess,
      AddressFields,
      CategoryField,
      ExtraInfoFields,
      DuplicateWarning
    },
    computed: {
      ...mapGetters([
        'lat',
        'lon',
        'details',
        'isLoggedIn',
        'isPopup',
        'isNote',
        'address',
        'isDuplicate'
      ])
    },
    methods: {
      ...mapMutations([
        'setDisplaySuccess',
        'setDisplayConfirmation'
      ]),
      ...mapActions([
        'getAddress',
        'checkDuplicateNote'
      ])
    }
  }
</script>

<style>
  h2 {
    text-align: left;
    margin: 0 10% 0;
    width: 80%;
  }

  .detail-wrapper {
    margin-top: 50px;
    margin-bottom: 60px;
  }

  img{
    width: 15px;
    height: 15px;
    margin-left: 5px;
  }

  .duplicateText {
    position: fixed;
    top: 40%;
    margin: 0 10% 10px;
    width: 80%;
    font-size: 24px;
  }

  .duplicateFormular {
    opacity: 0.2;
    filter: alpha(opacity=20);
  }
</style>
