<template>
    <div class="dialog" id="error-dialog" v-if="isError">
      <div class="dialog-title">
        {{t('error').title}}
      </div>

      <div id="error-section" class="section">
        <img id="error-img" src="../assets/error.png" alt="">
        <span id="error-message">{{error}}</span>
      </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'error-message',
    computed: {
      ...mapGetters([
        'error',
        'isError',
      ]),
    },
  };
</script>

<style lang="scss">

  @import "../scss/globals";

  #error-dialog {
    bottom:50px;
    width: 500px;
    margin-left: -250px;
    left: 50%;
    color: $error-color;
    border: 2px solid $error-color;
    display: flex;
    flex-direction: column;
    font-size: 18px;
  }

  #error-section {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  #error-img {
    height: 50px;
    width: 50px;
    opacity: 0.9;
  }

  #error-message {
    font-size: 16px;
    margin-left: 10px;
  }
</style>
