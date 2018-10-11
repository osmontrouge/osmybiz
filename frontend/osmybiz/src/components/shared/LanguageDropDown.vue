<template>

  <select id="translation-select" @click="onSelect" v-model="selected" >
    <option v-for="language in supportedLanguagesOptions" v-bind:value="language.value">
      {{ language.label }}
    </option>
  </select>
</template>

<script>
  import VueCookies from 'vue-cookies';

  const SUPPORTEDLANGUAGESOPTIONS = [
    { label: 'Deutsch', value: 'de' },
    { label: 'English', value: 'en' },
    { label: 'Français', value: 'fr' },
    { label: 'עברית', value: 'he' },
    { label: 'Magyar', value: 'hu' },
    { label: 'Italiano', value: 'it' },
    { label: 'Polski', value: 'pl' },
    { label: 'русский', value: 'ru' },
    { label: 'Svenska', value: 'sv' },
    { label: '汉语', value: 'zh_TW' },
  ];

  function getBrowserLanguages() {
    const browserLanguages = window.navigator.languages || [window.navigator.language
    || window.navigator.userLanguage];
    const browserLanguagesList = [];
    for (let i = 0; i < browserLanguages.length; i += 1) {
      browserLanguagesList.push(browserLanguages[i].replace('-', '_'));
      if (browserLanguages[i].length > 2) {
        browserLanguagesList.push(browserLanguages[i].slice(0, 2));
      }
    }
    return browserLanguagesList;
  }

  function getSupportedLanguages() {
    const supportedLanguagesList = [];
    for (let i = 0; i < SUPPORTEDLANGUAGESOPTIONS.length; i += 1) {
      supportedLanguagesList.push(SUPPORTEDLANGUAGESOPTIONS[i].value);
    }
    return supportedLanguagesList;
  }

  function setBrowserLanguageIfSupported(object) {
    const browserLanguagesList = getBrowserLanguages();
    const supportedLanguagesList = getSupportedLanguages();
    for (let i = 0; i < browserLanguagesList.length; i += 1) {
      const browserLanguage = browserLanguagesList[i];
      if (supportedLanguagesList.indexOf(browserLanguage) >= 0) {
        object.$store.commit('setTags', browserLanguage);
        object.$translate.setLang(browserLanguage);
        return;
      }
    }
  }

  export default {
    mounted() {
      if (this.$cookies.get('language')) {
        this.$store.commit('setTags', this.$cookies.get('language'));
        this.$translate.setLang(this.$cookies.get('language'));
      } else {
        setBrowserLanguageIfSupported(this);
      }
      this.selected = this.$translate.lang;
    },
    name: 'language-drop-down',
    data() {
      return {
        selected: '',
        supportedLanguagesOptions: SUPPORTEDLANGUAGESOPTIONS,
      };
    },
    methods: {
      onSelect(e) {
        this.$translate.setLang(e.target.value);
        this.$store.commit('setTags', e.target.value);
        this.$cookies.set('language', e.target.value, '30d');
      },
    },
    components: {
      VueCookies,
    },
  };
</script>
