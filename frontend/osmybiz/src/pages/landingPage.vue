<template>
  <div>
    <search-bar></search-bar>
    <tile-map></tile-map>
    <toggle-button></toggle-button>
    <login-help-text></login-help-text>
    <help-text></help-text>
    <update-list></update-list>

    <post-success></post-success>
  </div>
</template>

<script>
  import TileMap from './../components/TileMap'
  import SearchBar from './../components/SearchBar'
  import HelpText from './../components/HelpText'
  import UpdateList from './../components/UpdateList'
  import PostSuccess from './../components/PostSuccess'
  import ToggleButton from './../components/ToggleButton'
  import LoginHelpText from '../components/LoginHelpText'

  import {mapActions, mapMutations} from 'vuex'
  import * as _ from 'lodash'

  function extractToken (url) {
    const tokenRegex = /\?oauth_token=(.*)#\//
    const matches = tokenRegex.exec(url)
    if (_.isArray(matches) && matches.length > 1) {
      return matches[1]
    }
    return null
  }

  export default {
    mounted () {
      const token = extractToken(window.location.href)
      if (_.isString(token) && !_.isEmpty(token)) {
        this.setToken(token).then(() => {
          window.location.href = '/'
        })
      }
      this.setIsDuplicate(false)

      if (localStorage.getItem('showHelp')) {
        console.log(JSON.parse(localStorage.getItem('showHelp')))
        this.setShowHelp(JSON.parse(localStorage.getItem('showHelp')))
      }
      if (localStorage.getItem('showLoginHelp')) {
        console.log(JSON.parse(localStorage.getItem('showLoginHelp')))
        this.setShowLoginHelp(JSON.parse(localStorage.getItem('showLoginHelp')))
      }
    },
    methods: {
      ...mapActions(['setToken']),
      ...mapMutations(['setIsDuplicate', 'setShowHelp', 'setShowLoginHelp'])
    },
    components: {
      LoginHelpText,
      SearchBar,
      TileMap,
      ToggleButton,
      HelpText,
      UpdateList,
      PostSuccess
    }
  }

</script>

<style>

</style>
