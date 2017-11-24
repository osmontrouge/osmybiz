<template>
    <div class="header">
      <div class="title">
        OpenStreetMap My Business
      </div>
      <div class="buttons">
        <div v-if="isLoggedIn" class="user" >
          <span>{{user.name}}</span>
        </div>

        <div class="messages" v-if="isLoggedIn" @click="gotoMessages()">
          <icon name="envelope"></icon>
          <span class="unread" v-if="user.unReadCount > 0">{{user.unReadCount}}</span>
        </div>

        <select v-on:change="onSelect">
          <option value="de">Deutsch</option>
          <option value="en">English</option>
        </select>

        <button v-if="!isLoggedIn" @click="login()">Login</button>
        <button v-if="isLoggedIn" @click="logout()">Logout</button>

      </div>
    </div>
</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import 'vue-awesome/icons'
  import {loadTags} from '../store/detail'
  import Icon from 'vue-awesome/components/Icon.vue'

  // todo move to config
  const messageUrl = 'https://master.apis.dev.openstreetmap.org/user/'

  export default {
    mounted () {
      this.loadUser()
    },
    name: 'header-bar',
    computed: {
      ...mapGetters([
        'user',
        'isLoggedIn'
      ])
    },
    methods: {
      ...mapActions([
        'authenticate',
        'loadUser'
      ]),
      ...mapMutations([
        'logout'
      ]),
      login () {
        this.authenticate()
      },
      gotoMessages () {
        if (this.isLoggedIn) {
          window.open(messageUrl + this.user.name + '/inbox', '_blank')
        }
      },
      onSelect (e) {
        loadTags(e.target.value)
        this.$translate.setLang(e.target.value)
      }
    },
    components: {
      Icon
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
    align-items: baseline;
  }

  .messages {
    position: relative;
    display: inline-block;
    padding: 0 20px 0 20px;
    cursor: pointer;
  }

  .unread {
    background-color: red;
    color: white;
    font-weight:bold;
    padding: 1px 3px;
    font-size: 10px;
    position: absolute;
    height: 14px;
    line-height: 11px;
    border-radius: 7px;
    width: 14px;
    top: -4px;
    right: 10px;
  }

  button {
    margin: 8px 0 10px 10px;
  }

  select {
    border: 2px solid #7ebc6f;
    padding: 7px 8px;
    outline: none;
  }

</style>
