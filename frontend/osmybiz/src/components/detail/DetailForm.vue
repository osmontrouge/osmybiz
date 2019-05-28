<template>

  <div class="form-wrapper">

    <h3>{{ $t('detail.titles.title') }}</h3>

    <div class="form-fields">
      <div class="column">
        <div class="field">
          <div class="field-label">
            <label>{{ $t('detail.labels.name') }}*</label>
            <img class="info"
                 @mouseenter="showPopup($t('infoTexts.name'))"
                 @mouseleave="hidePopup()"
                 src="../../assets/info_black.png">
          </div>

          <input type="text"
                 name="name"
                 v-model="details.name"
                 :placeholder="$t('detail.placeholders.name')">

          <span v-show="details.name === ''"
                class="help is-danger">
            {{ $t('detail.validate.required') }}
          </span>
        </div>

        <div class="field">
          <div class="field-label">
            <label>{{ $t('detail.labels.opening_hours') }}</label>
            <img class="info"
                 @mouseenter="showPopup($t('infoTexts.opening_hours'))"
                 @mouseleave="hidePopup()"
                 src="../../assets/info_black.png">
          </div>

          <input type="text"
                 id="openingHoursTime"
                 v-model="details.opening_hours"
                 :placeholder="$t('detail.placeholders.opening_hours')">
        </div>

		<div class="field">
			<div class="field-label">
				<label>{{ $t('detail.labels.opening_hours_url') }}</label>
				<img class="info"
					@mouseenter="showPopup($t('infoTexts.opening_hours_url'))"
					@mouseleave="hidePopup()"
					src="../../assets/info_black.png">
			</div>
			
			<input type="text"
             v-on:blur="blurOpeningHours()"
             id="openingHoursURL"
					v-model="details.opening_hours_url"
					:placeholder="$t('detail.placeholders.opening_hours_url')">
		</div>
		
        <div class="field">
          <div class="field-label">
            <label>{{ $t('detail.labels.phone') }}</label>
            <img class="info"
                 @mouseenter="showPopup($t('infoTexts.phone'))"
                 @mouseleave="hidePopup()"
                 src="../../assets/info_black.png">
          </div>
          <input type="text"
                 v-model="details.phone"
                 :placeholder="$t('detail.placeholders.phone')">
        </div>

        <div class="field" :class="{ 'control': true }">
          <div class="field-label">
            <label>{{ $t('detail.labels.email') }}</label>
            <img class="info"
                 @mouseenter="showPopup($t('infoTexts.email'))"
                 @mouseleave="hidePopup()"
                 src="../../assets/info_black.png">
          </div>

          <input v-validate="'email'"
                 :class="{'is-error': errors.has('email') }"
                 name="email"
                 type="text"
                 v-model="details.email"
                 :placeholder="$t('detail.placeholders.email')">

          <span v-show="errors.has('email')"
                class="help is-danger">
            {{ $t('detail.validate.email') }}
          </span>
        </div>

        <div class="field">
          <div class="field-label">
            <label>{{ $t('detail.labels.website') }}</label>
            <img class="info"
                 @mouseenter="showPopup($t('infoTexts.website'))"
                 @mouseleave="hidePopup()"
                 src="../../assets/info_black.png">
          </div>

          <input v-validate="'url'"
                 :class="{'is-error': errors.has('website') }"
                 type="text"
                 name="website"
                 v-model="details.website"
                 :placeholder="$t('detail.placeholders.website')">

          <span v-show="errors.has('website')"
                class="help is-danger">
            {{ $t('detail.validate.website') }}
          </span>
        </div>

        <div class="field">
          <div class="field-label">
            <label>{{ $t('detail.labels.wheelchair') }}</label>
            <img class="info"
                 @mouseenter="showPopup($t('infoTexts.wheelchair'))"
                 @mouseleave="hidePopup()"
                 src="../../assets/info_black.png">
          </div>

          <select v-model="details.wheelchair">
            <option></option>
            <option value="yes">{{ $t('detail.labels.yes') }}</option>
            <option value="limited">{{ $t('detail.labels.limited') }}</option>
            <option value="no">{{ $t('detail.labels.no') }}</option>
          </select>
        </div>
      </div>

      <div class="column">
        <div class="field">
          <div class="field-label">
            <label>{{ $t('detail.labels.description') }}</label>
            <img class="info"
                 @mouseenter="showPopup($t('infoTexts.description'))"
                 @mouseleave="hidePopup()"
                 src="../../assets/info_black.png">
          </div>

          <textarea class="area"
                    v-model="details.description"
                    :placeholder="$t('detail.placeholders.description')"></textarea>
        </div>

        <div class="field">
          <div class="field-label">
            <label>{{ $t('detail.labels.note') }}</label>
            <img class="info"
                 @mouseenter="showPopup($t('infoTexts.note'))"
                 @mouseleave="hidePopup()"
                 src="../../assets/info_black.png">
          </div>

          <textarea class="area"
                    v-model="details.note"
                    :placeholder="$t('detail.placeholders.note')"></textarea>
        </div>
      </div>
    </div>

    <h5>{{ $t('detail.validate.subtitle') }}</h5>

  </div>

</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import Vue from 'vue';
  import VeeValidate from 'vee-validate';
  // import $ from 'jquery';
  // import isURL from '../../store/OpeningHoursConverter';

  Vue.use(VeeValidate);

  //  document.getElementById('openingHoursURL').addEventListener('blur', printTest, false);

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
      ]),
    },
    methods: {
      ...mapMutations([
        'setIsOwnCategory',
        'setApplyOffset',
        'showPopup',
        'hidePopup',
      ]),
      blurOpeningHours() {
        const input = document.getElementById('openingHoursURL').value;
        // getting the value works, now make the handling async.
        // const result = isURL(input);/* https://www.casaferlin.ch/en */

        if (document.getElementById('openingHoursTime').value === '') {
          const worker = new Worker('../../store/OpeningHoursConverter');
          worker.postMessage([input]);
        }
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
