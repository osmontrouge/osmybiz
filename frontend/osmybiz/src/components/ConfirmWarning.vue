<template>

  <div class="duplicate-wrapper" v-if="isConfirm">
    <div class="close-button" @click="toggle">
      <icon name="window-close"></icon>
    </div>
    <div class="warning-title">Sind Sie sicher?</div>
    <div class="section">
      Wenn Sie Weiter drücken, gehen alle Ihre Änderungen verloren.
    </div>
    <div class="dialog-buttons">
      <button class="confirm-button" @click="toggle">
        Abbrechen
      </button>
      <button class="confirm-button" @click="confirm">
        Weiter
      </button>
    </div>
  </div>

</template>

<script>
  import 'vue-awesome/icons'
  import Icon from 'vue-awesome/components/Icon.vue'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'confirm-warning',
    computed: {
      ...mapGetters([
        'isConfirm',
        'action'
      ])
    },
    methods: {
      ...mapMutations([
        'setIsConfirm'
      ]),
      toggle () {
        this.setIsConfirm(false)
      },
      confirm () {
        this.action()
      }
    },
    components: {
      Icon
    }
  }
</script>

<style scoped>
  .duplicate-wrapper {
    position: fixed;
    z-index: 100;
    width: 500px;
    margin-left: -250px;
    top: 45%;
    left: 50%;
    background-color: white;
    border: 2px solid red;
    padding: 12px;
    font-size: 16px;
    overflow-y: auto;
  }

  .section {
    margin-bottom: 6px;
    text-align: left;
  }

  .warning-title {
    font-weight: bold;
    text-align: left;
    margin-bottom: 5px;
    font-size: 18px;
  }

  .close-button {
    float: right;
    cursor: pointer;
  }

  .dialog-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .confirm-button {
    width: 30%;
  }
</style>
