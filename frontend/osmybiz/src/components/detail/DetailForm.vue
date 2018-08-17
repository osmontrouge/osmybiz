<template>

  <div class="form-wrapper">

    <h3>Details</h3>

    <div class="form-fields">
      <div class="column">
        <div class="field">
          <div class="field-label">
            <label>{{t('detail').labels.name}}*</label>
            <img class="info"
                 @mouseenter="show('name')"
                 @mouseleave="hide()"
                 src="../../assets/info_black.png">
          </div>

          <input type="text"
                 name="name"
                 v-model="details.name"
                 :placeholder="t('detail').placeholders.name">

          <span v-show="details.name === ''"
                class="help is-danger">
            {{t('detail').validate.required}}
          </span>
        </div>

        <div class="field">
          <div class="field-label">
            <label>{{t('detail').labels.opening_hours}}</label>
            <img class="info"
                 @mouseenter="show('opening_hours')"
                 @mouseleave="hide()"
                 src="../../assets/info_black.png">
          </div>

          <input type="text"
                 v-model="details.opening_hours"
                 :placeholder="t('detail').placeholders.opening_hours">
        </div>

        <div class="field">
          <div class="field-label">
            <label>{{t('detail').labels.phone}}</label>
            <img class="info"
                 @mouseenter="show('phone')"
                 @mouseleave="hide()"
                 src="../../assets/info_black.png">
          </div>
          <input type="text"
                 v-model="details.phone"
                 :placeholder="t('detail').placeholders.phone">
        </div>

        <div class="field" :class="{ 'control': true }">
          <div class="field-label">
            <label>{{t('detail').labels.email}}</label>
            <img class="info"
                 @mouseenter="show('email')"
                 @mouseleave="hide()"
                 src="../../assets/info_black.png">
          </div>

          <input v-validate="'email'"
                 :class="{'is-error': errors.has('email') }"
                 name="email"
                 type="text"
                 v-model="details.email"
                 :placeholder="t('detail').placeholders.email">

          <span v-show="errors.has('email')"
                class="help is-danger">
            {{t('detail').validate.email}}
          </span>
        </div>

        <div class="field">
          <div class="field-label">
            <label>{{t('detail').labels.website}}</label>
            <img class="info"
                 @mouseenter="show('website')"
                 @mouseleave="hide()"
                 src="../../assets/info_black.png">
          </div>

          <input v-validate="'url'"
                 :class="{'is-error': errors.has('website') }"
                 type="text"
                 name="website"
                 v-model="details.website"
                 :placeholder="t('detail').placeholders.website">

          <span v-show="errors.has('website')"
                class="help is-danger">
            {{t('detail').validate.website}}
          </span>
        </div>

        <div class="field">
          <div class="field-label">
            <label>{{t('detail').labels.wheelchair}}</label>
            <img class="info"
                 @mouseenter="show('wheelchair')"
                 @mouseleave="hide()"
                 src="../../assets/info_black.png">
          </div>

          <select v-model="details.wheelchair">
            <option></option>
            <option value="yes">{{t('detail').labels.yes}}</option>
            <option value="limited">{{t('detail').labels.limited}}</option>
            <option value="no">{{t('detail').labels.no}}</option>
          </select>
        </div>
      </div>

      <div class="column">
        <div class="field">
          <div class="field-label">
            <label>{{t('detail').labels.description}}</label>
            <img class="info"
                 @mouseenter="show('description')"
                 @mouseleave="hide()"
                 src="../../assets/info_black.png">
          </div>

          <textarea class="area"
                    v-model="details.description"
                    :placeholder="t('detail').placeholders.description"></textarea>
        </div>

        <div class="field">
          <div class="field-label">
            <label>{{t('detail').labels.note}}</label>
            <img class="info"
                 @mouseenter="show('note')"
                 @mouseleave="hide()"
                 src="../../assets/info_black.png">
          </div>

          <textarea class="area"
                    v-model="details.note"
                    :placeholder="t('detail').placeholders.note"></textarea>
        </div>
      </div>
    </div>

    <h5>{{t('detail').validate.subtitle}}</h5>

  </div>

</template>

<script>

  import { mapGetters, mapMutations } from 'vuex';
  import Vue from 'vue';
  import VeeValidate from 'vee-validate';
  import { showPopup, hidePopup } from '../../store/detail';

  Vue.use(VeeValidate);

  export default {
    mounted() {
      this.setApplyOffset(true);
    },
    name: 'detail-form',
    computed: {
      ...mapGetters([
        'details',
        'address',
        'tags',
        'isOwnCategory',
        'infoMap',
      ]),
    },
    methods: {
      ...mapMutations([
        'setIsOwnCategory',
        'setIsPopup',
        'setInfoText',
        'setApplyOffset',
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

  .area {
    flex-grow: 1;
  }

  .checkboxes {
    display: flex;
    flex-direction: row;
  }

  .checkbox-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
  }

  .checkbox, .radiobutton {
    height: 44px;
    width: 24px;
  }

  textarea {
    resize: none;
  }

  h3, h5 {
    text-align: left;
  }

  .form-fields {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: stretch;
  }

  .column {
    width: 49%;
    display: flex;
    flex-direction: column;
    align-items:stretch;
    justify-content: space-around;
  }

</style>
