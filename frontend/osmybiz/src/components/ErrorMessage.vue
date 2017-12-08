<template>
    <div class="error-dialog" v-if="isError">
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
  import {mapGetters} from 'vuex'

  export default {
    name: 'error-message',
    computed: {
      ...mapGetters([
        'error',
        'isError'
      ])
    }
  }
</script>

<style scoped>
  .error-dialog {
    position: fixed;
    z-index: 99;
    bottom:50px;
    width: 500px;
    margin-left: -250px;
    left: 50%;
    color: red;
    border: 2px solid red;
    background: white;
    display: flex;
    flex-direction: column;

    padding: 5px;
  }

  .dialog-title {
    font-weight: bold;
    text-align: left;
    margin-bottom: 5px;
    font-size: 18px;
  }

  .section {
    margin-bottom: 6px;
    text-align: left;
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
