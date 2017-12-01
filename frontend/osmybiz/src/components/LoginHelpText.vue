<template>
  <div>
    <div class="login-text" v-if="showLoginHelp && !isLoggedIn">
      <div class="help-header">
        <div class="help-title">Information</div>
        <icon name="arrow-up"></icon>
      </div>
      <div class="section">
        Um Änderungen in der Karte vorzunehmen müssen Sie sich mit einem OpenStreetMap-Login anmelden.
      </div>
      <div class="section">
        In dieser Ansicht können Sie aber bereits schauen, wie das ganze in Etwa funktioniert.
      </div>
      <button class="ok-btn" @click="confirm()">Ok</button>
    </div>

  </div>
</template>

<script>
  import 'vue-awesome/icons'
  import Icon from 'vue-awesome/components/Icon.vue'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    methods: {
      ...mapMutations(['setShowLoginHelp']),
      confirm () {
        this.setShowLoginHelp(false)
        localStorage.setItem('showLoginHelp', JSON.stringify(false))
      }
    },
    computed: {
      ...mapGetters(['showLoginHelp', 'isLoggedIn'])
    },
    components: {
      Icon
    },
    name: 'login-help-text'
  }
</script>

<style>
  .login-text {
    position: fixed;
    z-index: 999;
    top: 55px;
    right: 24px;
    font-size: 16px;
    background-color: white;
    padding: 12px;
    border-radius: 5px;
    max-width: 300px;
    max-height: 450px;
    overflow-y: auto;
  }

  .section {
    margin-bottom: 6px;
    text-align: left;
  }

  .help-header {
    display: flex;
    flex-direction: row;
  }

  .help-title {
    flex-grow: 1;
    font-weight: bold;
    text-align: left;
  }

  .ok-btn {
    float:right;
  }
</style>
