<template>

  <div class="search-bar-wrapper">

    <div class="input-wrapper">
      <input type="text" class="search-bar" placeholder="Suchen..." v-model="search">
      <div v-if="search && search.length" class="remove" @click="resetSearch()">x</div>
    </div>

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
    methods: {
      ...mapActions(['queryNominatim']),
      ...mapMutations([
        'setSearch',
        'selectPoint',
        'setMapPosition',
        'resetSearch'
      ]),
      pick (point) {
        this.setMapPosition(point.coords)
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
    margin-left: -251px;
    top:100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border: 2px solid #7ebc6f;
  }

  .search-bar {
    font-size: 28px;
    border: none !important;
    outline: none !important;
    width: 430px;
    height: 40px;
    padding: 1px !important;
  }

  .remove {
    width: 20px;
    font-size: 20px;
    cursor: pointer;
  }

  .input-wrapper {
    width: 450px;
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .suggestion-list {
    position: fixed;
    width: 500px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: space-around;
    top: 160px;
    border: 2px solid #7ebc6f;
    border-top: none;
  }

  .suggestion {
    background-color: white;
    width: 100%;
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
