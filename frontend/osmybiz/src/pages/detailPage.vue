<template>
  <div>
    <address-confirmation v-if="displayConfirmation"></address-confirmation>
    <detail-form v-if="!displaySuccess && !displayConfirmation"></detail-form>
    <post-success v-if="displaySuccess"></post-success>
  </div>
</template>

<script>
  import DetailForm from '@/components/DetailForm'
  import PostSuccess from '@/components/PostSuccess'
  import AddressConfirmation from '@/components/AddressConfirmation'
  import {mapGetters, mapMutations} from 'vuex'
  import * as _ from 'lodash'
  import {routes} from './../router'

  export default {
    mounted () {
      if (!_.isNumber(this.lat) || !_.isNumber(this.lon)) {
        this.$router.push({name: routes.Landing})
      }
      this.setDisplaySuccess(false)
      const hasData = this.details.category.value !== 0
      this.setDisplayConfirmation(!hasData)
    },
    components: {
      DetailForm,
      PostSuccess,
      AddressConfirmation
    },
    computed: {
      ...mapGetters([
        'displaySuccess',
        'displayConfirmation',
        'lat',
        'lon',
        'details'
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
</style>
