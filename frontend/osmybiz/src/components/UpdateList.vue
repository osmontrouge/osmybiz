<template>
  <div class="update-wrapper" v-if="show">
    <div class="update-title">
      Kartenänderungen
    </div>
    <div class="update" v-if="updateCount === 0">
      Keine Änderugen
    </div>
    <div class="update" v-for="update in updates">

      <div v-if="update.kind === 'delete'">
        Das Unternehmen {{update.name}} wurde entfernt.
      </div>

      <div v-if="update.kind === 'update'">
        Das Unternehmen {{update.name}} wurde bearbeitet.
      </div>

      <div class="actions">

        <button @click="confirm(update)" class="spacer icon-button" title="Als gelesen markieren">
          <icon name="check"></icon>
        </button>

        <button @click="zoom(update.coords)" class="spacer icon-button" title="Zoom">
          <icon name="search"></icon>
        </button>

        <button v-if="update.changeSet" @click="changeSet(update.changeSet)" class="spacer icon-button" title="Changeset">
          <icon name="clone"></icon>
        </button>

        <button @click="ignore(update)" v-if="update.kind === 'update'" class="icon-button" title="Punkt ignorieren">
          <icon name="volume-off"></icon>
        </button>

      </div>

    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import 'vue-awesome/icons'
  import Icon from 'vue-awesome/components/Icon.vue'
  import {osmUrl} from './../config/config'

  export default {
    methods: {
      ...mapMutations(['setMapPosition']),
      ...mapActions(['confirmUpdate', 'ignoreFutureUpdates']),
      zoom (coords) {
        this.setMapPosition(coords)
      },
      changeSet (changeSet) {
        const url = `${osmUrl}/changeset/${changeSet}`
        window.open(url, '_blank')
      },
      ignore (update) {
        this.ignoreFutureUpdates({update: update, user: this.user})
      },
      confirm (update) {
        this.confirmUpdate({update: update, user: this.user})
      }
    },
    computed: {
      ...mapGetters([
        'updates',
        'hasUpdates',
        'user',
        'showUpdates',
        'updateCount'
      ]),
      show () {
        return this.showUpdates
      }
    },
    components: {
      Icon
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
    font-size: 14px;
    background-color: white;
    border: 2px solid #7ebc6f;
    padding: 12px;
    overflow-y: auto;
  }

  .update-title {
    font-size:20px;
    font-weight:bold;
    text-align: left;
  }

  .update {
    margin-top: 24px;
    margin-bottom: 24px;
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

  .icon-button {
    width: 44px;
  }

</style>
