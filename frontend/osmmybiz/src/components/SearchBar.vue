<template>

  <div class="search-bar-wrapper">

    <input type="text" class="search-bar" placeholder="Suchen..." v-model="search">

    <div class="suggestion-list">
      <div v-for="sug in suggestions" class="suggestion">
        <span class="item">{{ sug.name }}</span>
      </div>
    </div>
  </div>

</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    created () {
      console.log(this)
    },
    methods: {
      ...mapActions(['queryNominatim']),
      ...mapMutations([
        'setSearch'
      ])
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
    height:70px;
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
    height: 50px;
    font-size: 32px;
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
    top: 120px
  }

  .suggestion {
    background-color: white;
    width: 450px;
    padding: 25px
  }

  .suggestion:hover {
    background-color: lightgrey
  }

</style>
