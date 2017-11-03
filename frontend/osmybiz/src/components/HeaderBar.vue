<template>
    <div class="header">
      <div class="title">
        OpenStreetMap My Business
      </div>
      <div class="buttons">
        <button @click="details()">Details</button>
        <button @click="login()">Login</button>
        <button @click="logout()">Logout</button>
        <span v-if="user.id !== ''">{{user}}</span>
      </div>
    </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: 'header-bar',
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    methods: {
      ...mapActions([
        'authenticate'
      ]),
      login () {
        this.authenticate()
      },
      logout () {
        // this.deauthenticate()
      },
      details () {
        // this.getDetails()
      }
    }
  }
</script>

<style scoped>

  .header {
    height: 50px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-size: 24px;
    font-weight:bold;
    margin: 0 24px;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    margin: 0 24px;
  }

  button {
    margin: 8px 0 10px 10px;
  }

</style>
