<template>
  <div>
    <search-bar></search-bar>
    <tile-map></tile-map>
    <toggle-button></toggle-button>
  </div>
</template>

<script>
  import TileMap from './../components/TileMap'
  import SearchBar from './../components/SearchBar'

  import {mapActions} from 'vuex'
  import * as _ from 'lodash'
  import ToggleButton from './../components/ToggleButton'

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
    },
    methods: {
      ...mapActions(['setToken'])
    },
    components: {
      SearchBar,
      TileMap,
      ToggleButton
    }
  }

</script>

<style>

</style>
