<template>
  <div class="detail-wrapper">
    <div class="detailcontent-wrapper">

      <div class="content-wrapper">
        <h2>{{t('detail').title}}</h2>

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
  import DetailForm from '../components/DetailForm.vue';
  import PostSuccess from '../components/PostSuccess.vue';
  import AddressFields from '../components/AddressFields.vue';
  import CategoryField from '../components/CategoryField.vue';
  import FormPopup from '../components/FormPopup.vue';
  import ExtraInfoFields from '../components/ExtraInfoFields.vue';
  import FormFooter from '../components/FormFooter.vue';
  import DuplicateWarning from '../components/DuplicateWarning.vue';
  import ConfirmWarning from '../components/ConfirmWarning.vue';

  import { routes } from './../router';
  import { getInfoTexts } from '../util/translate';

  export default {
    mounted() {
      if (!_.isNumber(this.lat) || !_.isNumber(this.lon) || !this.isLoggedIn) {
        this.$router.push({ name: routes.Landing });
      }
      this.setDisplaySuccess(false);

      this.getAddress();
      localStorage.setItem('details', JSON.stringify(this.details));

      this.setInfoMap(getInfoTexts());
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
        'lat',
        'lon',
        'details',
        'isLoggedIn',
        'isPopup',
        'isNote',
        'address',
        'isDuplicate',
      ]),
    },
    methods: {
      ...mapMutations([
        'setDisplaySuccess',
        'setDisplayConfirmation',
        'setInfoMap',
      ]),
      ...mapActions([
        'getAddress',
      ]),
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
