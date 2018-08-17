<template>

  <div class="address-wrapper">
    <div class="field-label">
      <h3>{{t('detail').titles.address}}</h3>
      <img class="info"
           @mouseenter="show('address')"
           @mouseleave="hide()"
           src="../../assets/info_black.png">
    </div>
    <div class="address-fields">
      <div class="row">
        <div class="left-field">
          <label>{{t('detail').labels.street}}(*)</label>
          <input type="text"
                 name="street"
                 v-model="address.street"
                 :placeholder="t('detail').placeholders.street">
        </div>

        <div class="middle"></div>

        <div class="right-field">
          <label>{{t('detail').labels.housenumber}}</label>
          <input type="text"
                 name="housenumber"
                 v-model="address.housenumber"
                 :placeholder="t('detail').placeholders.housenumber">
        </div>
      </div>

      <div class="field">
        <label>{{t('detail').labels.place}}(*)</label>
        <input type="text"
               name="place"
               v-model="address.place"
               :placeholder="t('detail').placeholders.place">

        <span v-show="address.street === '' && address.place === ''"
              class="help is-danger"> {{t('detail').validate.streetOrPlace}}
          </span>
      </div>

      <div class="row">
        <div class="left-field">
          <label>{{t('detail').labels.postcode}}*</label>
          <input type="text"
                 name="postcode"
                 v-model="address.postcode"
                 :placeholder="t('detail').placeholders.postcode">

          <span v-show="address.postcode === ''"
                class="help is-danger"> {{t('detail').validate.required}}
          </span>
        </div>

        <div class="middle"></div>

        <div class="right-field">
          <label>{{t('detail').labels.city}}*</label>
          <input type="text"
                 name="city"
                 v-model="address.city"
                 :placeholder="t('detail').placeholders.city">

          <span v-show="address.city === ''"
                class="help is-danger"> {{t('detail').validate.required}}
          </span>
        </div>
      </div>

      <div class="field">
        <label>{{t('detail').labels.country}}*</label>
        <input type="text"
               name="country"
               v-model="address.country"
               :placeholder="t('detail').placeholders.country">

        <span v-show="address.country === ''"
              class="help is-danger"> {{t('detail').validate.required}}
        </span>
      </div>
    </div>
  </div>

</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { showPopup, hidePopup } from '../../store/detail';

  export default {
    name: 'address-fields',
    computed: {
      ...mapGetters([
        'address',
        'infoMap',
      ]),
    },
    methods: {
      ...mapMutations([
        'setInfoText',
        'setIsPopup',
      ]),
      show(key) {
        showPopup(this.$translate.text(key));
      },
      hide() {
        hidePopup();
      },
    },
  };
</script>

<style lang="scss">

  @import "../../scss/globals";

  .address-fields {
    display: flex;
    flex-flow: column;
    align-items: stretch;
  }

  .row {
    display: flex;
    flex-direction: row;
    text-align: left;
  }

  .left-field {
    display: flex;
    flex-direction: column;
    padding-bottom: 12px;
    flex-grow: 1;
  }

  .right-field {
    display: flex;
    flex-direction: column;
    padding-bottom: 12px;
    flex-grow: 1;
  }

  .middle {
    flex-basis: 2%;
  }

</style>
