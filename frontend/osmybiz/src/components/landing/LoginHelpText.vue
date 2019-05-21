<template>
  <div>
    <div class="dialog" id="login-dialog" v-if="showLoginHelp && !isLoggedIn">
      <div class="close-button" @click="toggle">
        <icon name="window-close"></icon>
      </div>

      <div class="dialog-title">
        {{ $t('landing.loginhelp.title') }}
      </div>

      <div class="section">
        {{ $t('landing.loginhelp.section1') }}
      </div>
      <div class="section">
        {{ $t('landing.loginhelp.osmlinktext') }}
      </div>
      <div class="registerbutton">
        <button class="buttoncentered" @click="navigateToOSM()">OpenStreetMap</button>
      </div>
      <div class="section">
        {{ $t('landing.loginhelp.section2') }}
      </div>
    </div>

  </div>
</template>

<script>
  import 'vue-awesome/icons';
  import Icon from 'vue-awesome/components/Icon.vue';
  import { mapGetters, mapMutations } from 'vuex';
  import { osmUrl } from '../../config/config';

  export default {
    mounted() {
      this.setShowLoginHelp(true);
    },
    methods: {
      ...mapMutations(['setShowLoginHelp']),
      toggle() {
        this.setShowLoginHelp(false);
        localStorage.setItem('showLoginHelp', JSON.stringify(false));
      },
      navigateToOSM() {
        window.open(osmUrl);
      },
    },
    computed: {
      ...mapGetters(['showLoginHelp', 'isLoggedIn']),
    },
    components: {
      Icon,
    },
    name: 'login-help-text',
  };
</script>

<style scoped>

  #login-dialog {
    top: 55px;
    right: 24px;
    border-radius: 5px;
    max-width: 300px;
    max-height: 450px;
  }

  .registerbutton {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .buttoncentered {
    margin: 4px 10px 10px 10px;
  }

</style>
