<template>
  <div class="detail-wrapper">
    <div class="detailcontent-wrapper">

      <div class="content-wrapper">
        <h2 v-show="isNew">{{t('detail').titles.create}}</h2>
        <h2 v-show="!isNew">{{t('detail').titles.edit}}</h2>

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

  import { isNotModified } from '../store/detail';
  import { routes } from './../router';

  export default {
    mounted() {
      if (_.isEmpty(this.businessPosition) || !this.isLoggedIn) {
        this.$router.push({ name: routes.Landing });
      }
      this.setDisplaySuccess(false);

      this.getAddress(this.businessPosition);
      localStorage.setItem('details', JSON.stringify(this.details));
      this.setInfoMap(this.$translate.locale);
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
        'mapPosition',
        'details',
        'isLoggedIn',
        'isPopup',
        'isNote',
        'address',
        'isDuplicate',
        'isNew',
        'hasPermissionToLeaveDetailPage',
      ]),
    },
    methods: {
      ...mapMutations([
        'setDisplaySuccess',
        'setDisplayConfirmation',
        'setInfoMap',
        'setIsNew',
      ]),
      ...mapActions([
        'getAddress',
        'getConfirmation',
      ]),
    },
    beforeRouteLeave(to, from, next) {
      if (isNotModified(this)) {
        next();
      } else {
        this.getConfirmation(() => {
          if (this.hasPermissionToLeaveDetailPage) {
            this.$store.commit('setHasPermissionToLeaveDetailPage', false);
            next();
          } else {
            next(false);
          }
        });
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
