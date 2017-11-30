<template>
    <div class="error" v-if="isError">
      <img src="../assets/error.png" alt="">
      <span>{{error}}</span>
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
  .error {
    position: fixed;
    z-index: 99;
    bottom:50px;
    width: 500px;
    margin-left: -250px;
    left: 50%;
    color: #880000;
    border: 2px solid #880000;
    background: white;
    display: flex;
    align-items: center;

    padding: 5px;
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
