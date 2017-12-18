<template>

  <div class="dialog" id="confirm-dialog" v-if="isConfirm">
    <div class="close-button" @click="toggle">
      <icon name="window-close"></icon>
    </div>

    <div class="dialog-title">
      {{t('warning').confirm.title}}
    </div>

    <div class="section">
      {{t('warning').confirm.section}}
    </div>

    <div class="confirm-buttons">
      <button class="confirm-button" @click="toggle">
        {{t('warning').confirm.no}}
      </button>
      <button class="confirm-button" @click="confirm">
        {{t('warning').confirm.yes}}
      </button>
    </div>
  </div>

</template>

<script>
  import 'vue-awesome/icons';
  import Icon from 'vue-awesome/components/Icon.vue';
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'confirm-warning',
    computed: {
      ...mapGetters([
        'isConfirm',
        'action',
      ]),
    },
    methods: {
      ...mapMutations([
        'setIsConfirm',
      ]),
      toggle() {
        this.setIsConfirm(false);
      },
      confirm() {
        this.action();
      },
    },
    components: {
      Icon,
    },
  };
</script>

<style scoped>

  #confirm-dialog {
    width: 500px;
    margin-left: -250px;
    top: 45%;
    left: 50%;
    border: 2px solid red;
  }

  .confirm-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .confirm-button {
    width: 30%;
  }

</style>
