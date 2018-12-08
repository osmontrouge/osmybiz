<template>
  <div class="detail-wrapper">
    <div class="detailcontent-wrapper">

      <div class="content-wrapper">
        <h2 v-show="isNew">{{ $t('detail.titles.create') }}</h2>
        <h2 v-show="!isNew">{{ $t('detail.titles.edit') }}</h2>

        <category-field></category-field>
        <address-fields></address-fields>
        <detail-form></detail-form>
        <extra-info-fields></extra-info-fields>
      </div>

      <duplicate-warning></duplicate-warning>
      <confirm-warning></confirm-warning>
      <form-popup v-if="isPopup"></form-popup>
    </div>
    <form-footer></form-footer>
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import * as _ from 'lodash';
  import DetailForm from '../components/detail/DetailForm.vue';
  import PostSuccess from '../components/landing/PostSuccess.vue';
  import AddressFields from '../components/detail/AddressFields.vue';
  import CategoryField from '../components/detail/CategoryField.vue';
  import FormPopup from '../components/detail/FormPopup.vue';
  import ExtraInfoFields from '../components/detail/ExtraInfoFields.vue';
  import FormFooter from '../components/detail/FormFooter.vue';
  import DuplicateWarning from '../components/landing/DuplicateWarning.vue';
  import ConfirmWarning from '../components/detail/ConfirmWarning.vue';
  import { isNotModified, saveChangesTemporarily } from '../store/detail';
  import { routes } from './../router';


  export default {
    mounted() {
      if (_.isEmpty(this.businessPosition) || !this.isLoggedIn) {
        this.$router.push({ name: routes.Landing });
      }
      if (!this.isEditingUnsavedChanges) {
        this.getAddress(this.businessPosition);
        this.hideUserDialog();
        localStorage.setItem('details', JSON.stringify(this.details));
        this.setIsNew(!this.isNote);
      }
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
      DuplicateWarning,
    },
    computed: {
      ...mapGetters([
        'businessPosition',
        'mapCenter',
        'details',
        'isLoggedIn',
        'isPopup',
        'isNote',
        'address',
        'isDuplicate',
        'isNew',
        'osmId',
        'isEditingUnsavedChanges',
        'isFormSubmission',
        'isOwnCategory',
        'osmType',
        'noteId',
        'languageTags',
      ]),
      isModifiedAndNotSubmited() {
        return !isNotModified(this) && !this.isFormSubmission;
      },
    },
    methods: {
      ...mapMutations([
        'setIsNew',
        'displayUnsavedChangesNotification',
        'hideUnsavedChangesNotification',
        'setIsEditingUnsavedChanges',
        'setDetails',
        'setAddress',
        'setOsmId',
        'setIsNote',
        'setIsOwnCategory',
        'setNoteId',
        'setOsmType',
        'resetDetailState',
        'hideUserDialog',
      ]),
      ...mapActions([
        'getAddress',
        'getConfirmation',
      ]),
    },
    destroyed() {
      if (this.isModifiedAndNotSubmited) {
        saveChangesTemporarily();
        this.displayUnsavedChangesNotification();
      } else {
        this.hideUnsavedChangesNotification();
      }
      this.resetDetailState();
    },
  };
</script>

<style scoped>
  h2 {
    text-align: left;
  }

  .detailcontent-wrapper {
    margin: auto;
    max-width: 1000px;
  }

  .content-wrapper {
    margin-top: 50px;
    margin-bottom: 60px;
  }

  img{
    width: 15px;
    height: 15px;
    margin-left: 5px;
  }
</style>
