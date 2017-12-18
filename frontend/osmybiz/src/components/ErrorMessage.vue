<template>
    <div class="dialog" id="error-dialog" v-if="isError">
      <div class="dialog-title">
        {{t('error').title}}
      </div>

      <div class="section">
        <img src="../assets/error.png" alt="">
        <span>{{error}}</span>
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

<style scoped>
  #error-dialog {
    bottom:50px;
    width: 500px;
    margin-left: -250px;
    left: 50%;
    color: red;
    border: 2px solid red;
    display: flex;
    flex-direction: column;
  }

  .dialog-title {
    font-size: 18px;
  }

  .section {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  img {
    height: 50px;
    width: 50px;
  }

  span {
    font-size: 16px;
    margin-left: 10px;
  }
</style>
