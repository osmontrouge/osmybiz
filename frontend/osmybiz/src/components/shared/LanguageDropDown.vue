<template>
    <select id="locale-select" @click="saveLocaleAsCookie" v-model="$i18n.locale">
      <option v-for="(lang) in langs" :value="lang.value">{{ lang.label }}</option>
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

  function setBrowserLanguageIfSupported(context) {
    const browserLanguagesList = getBrowserLanguages();
    const supportedLanguagesList = getSupportedLanguages();
    for (let i = 0; i < browserLanguagesList.length; i += 1) {
      const browserLanguage = browserLanguagesList[i];
      if (supportedLanguagesList.indexOf(browserLanguage) >= 0) {
        context.$store.commit('setTags', browserLanguage);
        /* eslint-disable-next-line no-param-reassign */
        context.$i18n.locale = browserLanguage;
        return;
      }
    }
  }

  export default {
    mounted() {
      if (this.$cookies.get('language')) {
        this.$store.commit('setTags', this.$cookies.get('language'));
        /* eslint-disable-next-line no-param-reassign */
        this.$i18n.locale = this.$cookies.get('language');
      } else {
        setBrowserLanguageIfSupported(this);
      }
    },
    name: 'language-drop-down',
    data() {
      return {
        langs: SUPPORTEDLANGUAGESOPTIONS,
      };
    },
    methods: {
      saveLocaleAsCookie(e) {
        this.$store.commit('setTags', e.target.value);
        this.$cookies.set('language', e.target.value, '30d');
      },
    },
    components: {
      VueCookies,
    },
  };
</script>
