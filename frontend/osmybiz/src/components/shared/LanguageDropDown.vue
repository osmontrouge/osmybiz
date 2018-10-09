<template>

  <select id="translation-select" @click="onSelect" v-model="selected" >
    <option v-for="language in supportedLanguageList" v-bind:value="language.value">
      {{ language.label }}
    </option>
  </select>
</template>

<script>
  import VueCookies from 'vue-cookies';

  const supportedLanguageList = [
    { label: 'Deutsch', value: 'de' },
    { label: 'English', value: 'en' },
    { label: 'Français', value: 'fr' },
    { label: 'עברית', value: 'he' },
    { label: 'Magyar', value: 'hu' },
    { label: 'Italiano', value: 'it' },
    { label: 'Polski', value: 'pl' },
    { label: 'русский', value: 'ru' },
    { label: 'Svenska', value: 'sv' },
    { label: '汉语', value: 'zhTW' },
  ];

  function isSupportedLanguage(languageValue) {
    for (let i = 0; i < supportedLanguageList.length; i += 1) {
      if (languageValue === supportedLanguageList[i].value) {
        return true;
      }
    }
    return false;
  }

  export default {
    created() {
      if (this.$cookies.get('language')) {
        this.$translate.setLang(this.$cookies.get('language'));
      } else {
        let browserLanguages = [];
        if (window.navigator.languages) {
          browserLanguages = window.navigator.languages;
        } else {
          browserLanguages.push(window.navigator.userLanguage);
        }
        for (let i = 0; i < browserLanguages.length; i += 1) {
          if (isSupportedLanguage(browserLanguages[i].slice(0, 2))) {
            this.$translate.setLang(browserLanguages[i].slice(0, 2));
            break;
          }
        }
      }
      this.selected = this.$translate.lang;
    },
    name: 'language-drop-down',
    data() {
      return {
        supportedLanguageList,
      };
    },
    methods: {
      onSelect(e) {
        this.$translate.setLang(e.target.value);
        this.$cookies.set('language', e.target.value, '30d');
      },
    },
    components: {
      VueCookies,
    },
  };
</script>
