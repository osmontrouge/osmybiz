<template>
  <div class="update-wrapper" v-if="false">
    <div class="update-title">
      Änderungen
    </div>
    <div class="update" v-for="update in updates">

      <b>{{update.date | date('DD.MM.YYYY')}}:</b>
      <b>{{update.name}}</b>

      <div v-if="update.kind === 'note'">
        Ihre Notiz wurde vom Status {{update.oldState}} in den Status {{update.newState}} verschoben.
      </div>

      <div v-if="update.kind === 'node'">
        Das Geschäft wurde bearbeitet.
      </div>

      <div class="actions">
        <button class="spacer" @click="zoom(update.coords)">Zoom</button>
        <button>Changeset</button>
      </div>

      <div class="clickable-text">
        Weitere Änderungen an diesem Punkt ignorieren
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {DateFilter} from './../filters/dateFilter'

  export default {
    methods: {
      ...mapMutations(['setMapPosition']),
      zoom (coords) {
        console.log(coords)
        this.setMapPosition(coords)
      }
    },
    computed: {
      ...mapGetters([
        'isLoggedIn',
        'updates',
        'hasUpdates'
      ]),
      show () {
        return this.isLoggedIn && this.hasUpdates
      }
    },
    filters: {
      DateFilter
    },
    name: 'update-list'
  }
</script>

<style>

  .update-wrapper {
    position: fixed;
    z-index: 99;
    bottom: 110px;
    top: 74px;
    right: 24px;
    width: 250px;
    font-size: 16px;
    background-color: white;
    border: 2px solid #7ebc6f;
    padding: 12px
  }

  .update-title {
    font-size:20px;
    font-weight:bold;
  }

  .update {
    margin-top: 12px;
    text-align: left;
  }

  .actions {
    display: flex;
    justify-content: flex-start;
    margin-top: 12px;
  }
  .spacer {
    margin-right: 12px;
  }

  .clickable-text {
    cursor: pointer;
    text-decoration: underline;
  }

</style>
