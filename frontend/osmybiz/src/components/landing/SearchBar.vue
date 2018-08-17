<template>

  <div class="search-bar-wrapper">

    <div class="input-wrapper">
      <input type="text" class="search-bar" :placeholder="t('landing').search" v-model="search">
      <div v-if="search && search.length" class="remove" @click="resetSearch()">x</div>
    </div>

    <div class="suggestion-list" v-if="suggestions.length">
      <div v-for="sug in suggestions" class="suggestion" @click="pick(sug)">

        <div class="main-text">
          <span v-if="sug.address.street">
            {{ sug.address.street }},
          </span>
          <span v-if="sug.address.housenumber">
            {{ sug.address.housenumber }},
          </span>
          {{ sug.address.postcode}}
          {{ sug.address.city}}
        </div>

        <div class="sub-text">{{sug.address.country}}</div>

      </div>
    </div>
  </div>

</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';

  export default {
    methods: {
      ...mapActions(['queryNominatim']),
      ...mapMutations([
        'setSearch',
        'selectPoint',
        'setMapPosition',
        'resetSearch',
      ]),
      pick(point) {
        this.setMapPosition(point.coords);
        this.selectPoint(point);
      },
    },
    computed: {
      ...mapGetters([
        'searchText',
        'suggestions',
      ]),
      search: {
        get() { return this.searchText; },
        set(value) {
          this.setSearch(value);
          this.queryNominatim(value, this.$translate.lang);
        },
      },
    },
    name: 'search-bar',
  };
</script>

<style lang="scss">

  @import "../../scss/globals";

  .search-bar-wrapper {
    position: fixed;
    height:50px;
    width: 500px;
    z-index: 99;
    left: 50%;
    margin-left: -251px;
    top:60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border: 2px solid $primary-color;
  }

  .search-bar {
    font-size: 22px;
    border: none !important;
    outline: none !important;
    width: 500px;
    height: 20px;
    padding: 1px !important;
  }

  .remove {
    width: 20px;
    font-size: 20px;
    cursor: pointer;
  }

  .input-wrapper {
    width: 450px;
    height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .suggestion-list {
    font-size:12px;
    position: fixed;
    width: 500px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: space-around;
    top: 110px;
    border: 2px solid $primary-color;
    border-top: none;
  }

  .suggestion {
    background-color: white;
    height:50px;
    width: 100%;
    padding: 10px 25px;
    text-align: left;
    display: flex;
    flex-direction: row;
  }

  .suggestion:hover {
    background-color: lightgrey;
    cursor: pointer;
  }

  .main-text {
    font-size:18px;
    flex-grow: 1;
  }

  .sub-text {
    text-align: right;
    color: grey;
    flex-grow: 1;
  }

</style>
