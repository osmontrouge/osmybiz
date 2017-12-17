<template>
  <div>
    <div class="help-dialog-icon">
      <button @click="toggle()">
        <icon name="question-circle"></icon>
      </button>
    </div>

    <div class="help-dialog" v-if="showHelp">
      <div class="close-button" @click="toggle">
        <icon name="window-close"></icon>
      </div>

      <div class="dialog-title">{{t('landing').help.title}}</div>

      <div class="section">
        {{t('landing').help.section1}}
      </div>

      <div class="section">
        {{t('landing').help.section2}}
      </div>

      <div class="section">
        {{t('landing').help.section3}}
      </div>
    </div>

  </div>
</template>

<script>
  import 'vue-awesome/icons';
  import Icon from 'vue-awesome/components/Icon.vue';
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    methods: {
      ...mapMutations(['setShowHelp']),
      toggle () {
        this.setShowHelp(!this.showHelp)
        localStorage.setItem('showHelp', JSON.stringify(this.showHelp))
      }
    },
    computed: {
      ...mapGetters(['showHelp']),
    },
    components: {
      Icon,
    },
    name: 'help-text',
  };
</script>

<style>
  .help-dialog-icon {
    position: fixed;
    z-index: 99;
    bottom: 50px;
    left: 24px;
    font-size: 16px;
  }

  .help-dialog {
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
  .dialog-title {
    font-weight: bold;
    text-align: left;
  }

  .close-button {
    float: right;
    cursor: pointer;
  }
</style>
