<template>
  <div>
    <address-confirmation v-if="displayConfirmation"></address-confirmation>
    <detail-form v-if="!displaySuccess && !displayConfirmation"></detail-form>
    <post-note-success v-if="displaySuccess"></post-note-success>
  </div>
</template>

<script>
  import DetailForm from '@/components/DetailForm'
  import PostNoteSuccess from '@/components/PostNoteSuccess'
  import AddressConfirmation from '@/components/AddressConfirmation'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    mounted () {
      this.setDisplaySuccess(false)
      this.setDisplayConfirmation(true)
    },
    components: {
      DetailForm,
      PostNoteSuccess,
      AddressConfirmation
    },
    computed: {
      ...mapGetters([
        'displaySuccess',
        'displayConfirmation'
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
