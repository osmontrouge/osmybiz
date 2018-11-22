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

  import { isNotModified, getUnsavedChangesFromCookies } from '../store/detail';
  import { routes } from './../router';

  export const UNSAVEDCHANGESTIME = 30;

  export default {
    mounted() {
      if (_.isEmpty(this.businessPosition) || !this.isLoggedIn) {
        this.$router.push({ name: routes.Landing });
      }
      if (this.isEditingUnsavedChanges) {
        getUnsavedChangesFromCookies(this);
      } else {
        this.getAddress(this.businessPosition);
      }
      this.setDisplaySuccess(false);
      localStorage.setItem('details', JSON.stringify(this.details));
      this.setIsNew(!this.isNote);
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
        'hasSavedChanges',
        'isOwnCategory',
        'osmType',
      ]),
    },
    methods: {
      ...mapMutations([
        'setDisplaySuccess',
        'setIsNew',
        'setDisplayUnsavedChangesNotification',
        'setIsEditingUnsavedChanges',
        'setDetails',
        'setAddress',
        'setOsmId',
        'setIsNote',
        'setHasSavedChanges',
        'setIsOwnCategory',
        'setNoteId',
        'setOsmType',
      ]),
      ...mapActions([
        'getAddress',
        'getConfirmation',
      ]),
    },
    beforeRouteLeave(to, from, next) {
      // TODO:  refactor this part https://stackoverflow.com/questions/42295340/how-to-clear-state-in-vuex-store
      this.setIsEditingUnsavedChanges(false);
      this.setOsmId(null);
      this.setNoteId(null);
      if (isNotModified(this) || this.hasSavedChanges) {
        this.setHasSavedChanges(false);
        // For the case when DisplayUnsavedChangesNotication is still true (5 sec
        // time out has not been up yet)
        this.setDisplayUnsavedChangesNotification(false);
        next();
      } else {
        this.setDisplayUnsavedChangesNotification(true);
        setTimeout(() => {
          this.setDisplayUnsavedChangesNotification(false);
        }, UNSAVEDCHANGESTIME * 1000);
        const unsavedChanges = {
          address: this.address,
          details: this.details,
          business: this.business,
          isNote: this.isNote,
          osmId: this.osmId,
          isOwnCategory: this.isOwnCategory,
          noteId: this.noteId,
          osmType: this.osmType,
        };
        this.$cookies.set('unsavedChanges', unsavedChanges, UNSAVEDCHANGESTIME + 2);
        next();
      }
    },
  };
</script>

<style>
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
