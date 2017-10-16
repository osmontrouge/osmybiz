<template>

  <div class="search-bar-wrapper">

    <input type="text" class="search-bar" placeholder="Suchen..." v-model="search">

    <div class="suggestion-list" v-if="suggestions.length">
      <div v-for="sug in suggestions" class="suggestion" @click="pick(sug)">

        <div class="main-text">{{ sug.name }}</div>
        <div class="sub-text">{{sug.country}}</div>

      </div>
    </div>
  </div>

</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    created () {
    },
    methods: {
      ...mapActions(['queryNominatim']),
      ...mapMutations([
        'setSearch',
        'selectPoint',
        'setPosition'
      ]),
      pick (point) {
        this.setPosition(point.coords)
        this.selectPoint(point)
      }
    },
    computed: {
      ...mapGetters([
        'searchText',
        'suggestions'
      ]),
      search: {
        get () { return this.searchText },
        set (value) {
          this.setSearch(value)
          this.queryNominatim(value)
        }
      }
    },
    name: 'search-bar'
  }
</script>

<style>

  .search-bar-wrapper {
    position: fixed;
    height:60px;
    width: 500px;
    z-index: 99;
    left: 50%;
    margin-left: -250px;
    top:50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;

  }

  .search-bar {
    width: 450px;
    height: 40px;
    font-size: 28px;
    border: none;
    outline: none;
  }

  .suggestion-list {
    position: fixed;
    width: 500px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: space-around;
    top: 110px;
    border-top: 1px solid grey
  }

  .suggestion {
    background-color: white;
    width: 450px;
    padding: 10px 25px;
    text-align: left;
  }

  .suggestion:hover {
    background-color: lightgrey;
    cursor: pointer;
  }

  .main-text {
    font-size:20px;
  }

  .sub-text {
    text-align: right;
    color: grey;
  }

</style>
