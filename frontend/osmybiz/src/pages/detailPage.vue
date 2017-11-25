<template>
  <div>
    <h2>{{t('detail').title}}</h2>
    <category-field v-if="!displaySuccess"></category-field>
    <address-fields v-if="!displaySuccess"></address-fields>
    <detail-form v-if="!displaySuccess"></detail-form>
    <post-success v-if="displaySuccess"></post-success>
  </div>
</template>

<script>
  import DetailForm from '@/components/DetailForm'
  import PostSuccess from '@/components/PostSuccess'
  import AddressFields from '../components/AddressFields'
  import CategoryField from '../components/CategoryField'
  import {mapGetters, mapMutations} from 'vuex'
  import * as _ from 'lodash'
  import {routes} from './../router'

  export default {
    mounted () {
      if (!_.isNumber(this.lat) || !_.isNumber(this.lon) || !this.isLoggedIn) {
        this.$router.push({name: routes.Landing})
      }
      this.setDisplaySuccess(false)
      const hasData = this.details.category.value !== 0
      this.setDisplayConfirmation(!hasData)
    },
    components: {
      DetailForm,
      PostSuccess,
      AddressFields,
      CategoryField
    },
    computed: {
      ...mapGetters([
        'displaySuccess',
        'displayConfirmation',
        'lat',
        'lon',
        'details',
        'isLoggedIn'
      ])
    },
    methods: {
      ...mapMutations([
        'setDisplaySuccess',
        'setDisplayConfirmation'
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
