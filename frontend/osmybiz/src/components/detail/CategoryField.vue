<template>
  <div class="category-wrapper">
    <div class="field">
      <div class="field-label">
        <h3>{{ $t('detail.titles.category') }}*</h3>
        <img class="info"
             @mouseenter="showPopup($t('infoTexts.category'))"
             @mouseleave="hidePopup()"
             src="../../assets/info_black.png">
      </div>

      <div v-show="!isOwnCategory" class="category-field">
        <basic-select v-show="!isOwnCategory"
                      :options="this.categoryFields"
                      :selected-option="details.category"
                      :placeholder="$t('detail.placeholders.category')"
                      @select="onSelect"
                      class="basic-select"
                      ref="categorySelection">
        </basic-select>

        <button class="button" @click="setOwnCategory()">
          {{ $t('detail.buttons.owncategory') }}
        </button>
      </div>


      <div v-show="isOwnCategory">
        <div class="category-field">
          <input v-model="details.category.text"
                 type="text"
                 :placeholder="$t('detail.placeholders.owncategory')"
                 name="category-input"/>
          <button class="button" @click="setPredefinedCategory()">
            {{ $t('detail.buttons.choosecategory') }}
          </button>
        </div>
        <div>
           {{ $t('detail.ownCategoryInfo') }}
        </div>
      </div>

      <span v-show="details.category.text === ''"
            class="help is-danger">
          {{ $t('detail.validate.required') }}
        </span>
    </div>
  </div>
</template>

<script>
  import { BasicSelect } from 'vue-search-select';
  import Vue from 'vue';
  import VeeValidate from 'vee-validate';
  import { mapGetters, mapMutations } from 'vuex';

  Vue.use(VeeValidate);

  export default {
    name: 'category-field',
    mounted() {
      this.setIsOwnCategory(false);
    },
    computed: {
      ...mapGetters([
        'details',
        'isOwnCategory',
        'categoryFields',
        'isNote',
        'isNew',
        'languageTags',
      ]),
    },
    watch: {
      categoryFields: function updateSelectedOption() {
        this.$nextTick(() => {
          const { categorySelection } = this.$refs;
          let option = {};
          for (let i = 0; i < categorySelection.options.length; i += 1) {
            option = categorySelection.options[i];
            if (option.value === categorySelection.selectedOption.value) {
              categorySelection.selectItem(option);
              break;
            }
          }
        });
      },
    },
    methods: {
      ...mapMutations([
        'setIsOwnCategory',
        'setIsNote',
        'setOsmType',
        'showPopup',
        'hidePopup',
      ]),
      setPredefinedCategory() {
        if (this.isNew) {
          this.setIsNote(false);
          this.setOsmType('node');
        }
        this.setIsOwnCategory(false);
        this.details.category = { value: 0, text: '' };
      },
      setOwnCategory() {
        this.setIsNote(true);
        this.setIsOwnCategory(true);
        if (this.isNew) {
          this.setOsmType('note');
        }
        this.details.category = { value: 0, text: '' };
      },
      onSelect(item) {
        // Intended to copy by value by stringify then parse it.
        this.details.category = JSON.parse(JSON.stringify(item));
      },
    },
    components: {
      BasicSelect,
    },
  };
</script>

<style lang="scss">

  @import "../../scss/globals";

  .category-field {
    display: flex;
    flex-direction: row;
  }

  .category-field input, .basic-select {
    flex-grow: 5 !important;
  }

  .category-field button {
    flex: 0 0;
    flex-basis: auto;
    margin: 0 0 0 10px;
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
