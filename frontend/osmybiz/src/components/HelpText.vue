<template>
  <div>
    <div class="help-text-icon">
      <button @click="toggle()">
        <icon name="question-circle"></icon>
      </button>
    </div>

    <div class="help-text" v-if="showHelp">
      <div class="help-title">{{t('landing').help.title}}</div>
      <div class="section">
        {{t('landing').help.section1}}
      </div>
      <div class="section">
        {{t('landing').help.section2}}
      </div>
      <div class="section">
        {{t('landing').help.section3}}
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
      ...mapMutations(['setShowHelp']),
      confirm () {
        this.setShowHelp(false)
        localStorage.setItem('showHelp', JSON.stringify(false))
      },
      toggle () {
        this.setShowHelp(!this.showHelp)
        localStorage.setItem('showHelp', JSON.stringify(this.showHelp))
      }
    },
    computed: {
      ...mapGetters(['showHelp'])
    },
    components: {
      Icon
    },
    name: 'help-text'
  }
</script>

<style>
  .help-text-icon {
    position: fixed;
    z-index: 99;
    bottom: 50px;
    left: 24px;
    font-size: 16px;
  }

  .help-text {
    position: fixed;
    z-index: 99;
    bottom: 50px;
    left: 100px;
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
  .help-title {
    font-weight: bold;
    text-align: left;
  }

  .ok-btn {
    float:right;
  }
</style>
