<template>
  <div class="category-wrapper">
    <div class="field">
      <div class="field-label">
        <h3>{{t('detail').titles.category}}*</h3>
        <img class="info"
             @mouseenter="show('category')"
             @mouseleave="hide()"
             src="../assets/info_black.png">
      </div>

      <div v-show="!isOwnCategory" class="Category-field">
        <basic-select v-show="!isOwnCategory"
                      :options="this.tags"
                      :selected-option="details.category"
                      :placeholder="t('detail').placeholders.category"
                      @select="onSelect"
                      class="basic-select">
        </basic-select>

        <button class="button" @click="showInput()">
          {{t('detail').buttons.owncategory}}
        </button>
      </div>


      <div v-show="isOwnCategory" class="Category-field">
        <input v-model="details.category.text"
               type="text"
               :placeholder="t('detail').placeholders.owncategory"
               name="category-input"/>
        <button class="button" @click="hideInput()">
          {{t('detail').buttons.choosecategory}}
        </button>
      </div>

      <span v-show="details.category.text === ''"
            class="help is-danger">
          {{t('detail').validate.required}}
        </span>
    </div>
  </div>
</template>

<script>
  import { BasicSelect } from 'vue-search-select';
  import Vue from 'vue';
  import VeeValidate from 'vee-validate';
  import { mapGetters, mapMutations } from 'vuex';
  import { showPopup, hidePopup } from '../store/detail';


  Vue.use(VeeValidate);

  export default {
    name: 'category-field',
    computed: {
      ...mapGetters([
        'details',
        'tags',
        'isOwnCategory',
        'infoMap',
      ]),
    },
    methods: {
      ...mapMutations([
        'setIsOwnCategory',
        'setInfoText',
        'setIsPopup',
      ]),
      hideInput() {
        this.setIsOwnCategory(false);
        this.details.category = { value: 0, text: '' };
      },
      showInput() {
        this.setIsOwnCategory(true);
        this.details.category = { value: 0, text: '' };
      },
      show(key) {
        showPopup(key);
      },
      onSelect(item) {
        this.details.category = item;
      },
      hide() {
        hidePopup();
      },
    },
    components: {
      BasicSelect,
    },
  };
</script>

<style lang="scss">

  @import "../scss/globals";

  .category-wrapper {
    margin: 15px 10% 0;
    width: 80%;
  }

  .Category-field {
    display: flex;
    flex-direction: row;
  }

  .Category-field input, .basic-select {
    flex-grow: 5 !important;
  }

  .Category-field button {
    flex: 0 0;
    flex-basis: auto;
    margin-left: 10px;
  }

  .basic-select, .basic-select:hover, .basic-select:focus {
    border: 2px solid $primary-color !important;
  }

  .menu {
    border: 2px solid $primary-color !important;
    border-top: none !important;
    margin: 0px -2px !important;
    min-width: calc(100% + 2px) !important;
    width: calc(100% + 4px) !important;
  }
</style>
