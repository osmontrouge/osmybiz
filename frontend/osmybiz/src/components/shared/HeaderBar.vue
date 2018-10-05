<template>
    <div class="header">
      <div class="title">
        <a href="/">
          OpenStreetMap My Business
        </a>
      </div>
      <div class="buttons">
        <div class="about">
          <a href="http://wiki.openstreetmap.org/wiki/OSMyBiz"
             class="external-link"
             target="_blank">
            {{t('header').about}}
            <icon class="link-icon" name="external-link-alt"></icon>
          </a>
        </div>

        <select id="translation-select"
                v-on:change="onSelect">
          <option value="de">Deutsch</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="he">עברית</option>
          <option value="hu">Magyar</option>
          <option value="it">Italiano</option>
          <option value="pl">Polski</option>
          <option value="ru">русский</option>
          <option value="sv">Svenska</option>
          <option value="zhTW">汉语</option>
        </select>

        <div v-if="isLoggedIn" class="user" >
          <span>{{user.name}}</span>
        </div>

        <div class="messages" v-if="isLoggedIn" @click="gotoMessages()" :title="t('header').messagetitle">
          <icon name="envelope"></icon>
          <span class="unread" v-if="user.unReadCount > 0">{{user.unReadCount}}</span>
        </div>

        <div class="messages" v-if="isLoggedIn" @click="toggleUpdates()" :title="t('header').updatestitle">
          <icon name="bell"></icon>
          <span class="unread" v-if="updateCount > 0">{{updateCount}}</span>
        </div>

        <button v-if="!isLoggedIn" @click="login()">Login</button>
        <button v-if="isLoggedIn" @click="signOff()">Logout</button>

      </div>
    </div>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import 'vue-awesome/icons';
  import Icon from 'vue-awesome/components/Icon.vue';
  import { osmUrl } from '../../config/config';

  const messageUrl = `${osmUrl}/user/`;

  export default {
    mounted() {
      if (this.$translate.$cookies.get('lang')) {
        this.$translate.setLang(this.$translate.$cookies.get('lang'));
        document.getElementById('translation-select').value = this.$translate.$cookies.get('lang');
      } else {
        // default language
        this.$translate.setLang('de');
        document.getElementById('translation-select').value = 'de';
      }
      this.loadUser();
      this.$store.subscribe((mut) => {
        if (mut.type === 'setUser') {
          if (this.isLoggedIn) {
            this.loadUpdates(this.user);
          }
        }
      });
    },
    name: 'header-bar',
    computed: {
      ...mapGetters([
        'user',
        'isLoggedIn',
        'updateCount',
      ]),
    },
    methods: {
      ...mapActions([
        'authenticate',
        'loadUser',
        'loadUpdates',
      ]),
      ...mapMutations([
        'logout',
        'setTags',
        'toggleUpdates',
        'setInfoMap',
      ]),
      login() {
        this.authenticate();
      },
      signOff() {
        this.logout();
        window.location.reload();
      },
      gotoMessages() {
        if (this.isLoggedIn) {
          window.open(`${messageUrl + this.user.name}/inbox`, '_blank');
        }
      },
      onSelect(e) {
        this.$translate.setLang(e.target.value);
        this.$translate.$cookies.set('lang', e.target.value, 30);
      },
    },
    components: {
      Icon,
    },
  };
</script>

<style lang="scss">

  @import "../../scss/globals";

  .header {
    position: fixed;
    margin: auto;
    height: 50px;
    width: 100%;
    top: 0;
    z-index: 9999;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: white;
  }

  .title {
    font-size: 24px;
    font-weight:bold;
    margin: 0 24px;
    color: $primary-color;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    margin: 0 24px;
    align-items: baseline;
  }

  .about {
    font-size: 18px;
    font-weight:bold;
    margin: 0 10px;
    flex-grow: 1;
  }

  .about a, .title a{
    color: $primary-color;
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
    padding: 1px 4px;
    font-size: 12px;
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

  #translation-select {
    margin-right: 10px;
    padding: 7px 8px;
    outline: none;
  }

</style>
