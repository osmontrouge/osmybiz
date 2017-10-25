<template>
  <div>
    <address-confirmation v-if="!displaySuccess"></address-confirmation>
    <detail-form v-if="!displaySuccess"></detail-form>
    <post-note-success v-if="displaySuccess"></post-note-success>
  </div>
</template>

<script>
  import DetailForm from '@/components/DetailForm'
  import PostNoteSuccess from '@/components/PostNoteSuccess'
  import AddressConfirmation from '@/components/AddressConfirmation'
  import {mapGetters} from 'vuex'

  export default {
    components: {
      DetailForm,
      PostNoteSuccess,
      AddressConfirmation
    },
    computed: {
      ...mapGetters([
        'displaySuccess'
      ])
    }
  }
</script>

<style>
</style>
