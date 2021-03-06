<template>
  <div>
    <search-bar></search-bar>
    <tile-map></tile-map>
    <toggle-button></toggle-button>
    <login-help-text></login-help-text>
    <help-text></help-text>
    <watch-list></watch-list>

    <post-success></post-success>
    <duplicate-warning></duplicate-warning>
    <unsaved-changes-notification></unsaved-changes-notification>
    <form-popup v-if="isPopup" x-offset="-320"></form-popup>
  </div>
</template>

<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex';
  import * as _ from 'lodash';
  import TileMap from '../components/landing/TileMap.vue';
  import SearchBar from '../components/landing/SearchBar.vue';
  import HelpText from '../components/landing/HelpText.vue';
  import PostSuccess from '../components/landing/PostSuccess.vue';
  import ToggleButton from '../components/landing/ToggleButton.vue';
  import LoginHelpText from '../components/landing/LoginHelpText.vue';
  import WatchList from '../components/landing/WatchList.vue';
  import DuplicateWarning from '../components/landing/DuplicateWarning.vue';
  import UnsavedChangesNotification from '../components/landing/UnsavedChangesNotification.vue';
  import FormPopup from '../components/detail/FormPopup.vue';

  function extractToken(url) {
    const tokenRegex = /\?oauth_token=(.*)#\//;
    const matches = tokenRegex.exec(url);
    if (_.isArray(matches) && matches.length > 1) {
      return matches[1];
    }
    return null;
  }

  export default {
    mounted() {
      const token = extractToken(window.location.href);
      if (_.isString(token) && !_.isEmpty(token)) {
        this.setToken(token).then(() => {
          window.location.href = window.location.pathname;
        });
      }
      this.setIsDuplicate(false);

      if (localStorage.getItem('showHelp')) {
        this.setShowHelp(JSON.parse(localStorage.getItem('showHelp')));
      }
      if (localStorage.getItem('showLoginHelp')) {
        this.setShowLoginHelp(JSON.parse(localStorage.getItem('showLoginHelp')));
      }
    },
    methods: {
      ...mapActions(['setToken']),
      ...mapMutations(['setIsDuplicate', 'setShowHelp', 'setShowLoginHelp']),
    },
    computed: {
      ...mapGetters([
        'isPopup',
      ]),
    },
    components: {
      LoginHelpText,
      SearchBar,
      TileMap,
      ToggleButton,
      HelpText,
      PostSuccess,
      DuplicateWarning,
      UnsavedChangesNotification,
      WatchList,
      FormPopup,
    },
  };

</script>
