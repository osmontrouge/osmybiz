<template>

  <div class="success-wrapper" v-if="displaySuccess">
    <div class="success-button" @click="toggleSuccess">
      <icon name="window-close"></icon>
    </div>
    <div class="node-success" v-if="!isNote">
      <div class="success-title">Neues Unternehmen erstellt</div>
      <div class="section">
        <a :href="node.link" target="_blank">Link zu OpenStreetMap</a>
      </div>
      <div class="section">
        Adresse:
        <span v-if="node.address.street">
          {{node.address.street}}
        </span>
        <span v-if="node.address.housenumber">
          {{' ' + node.address.housenumber}}
        </span>
        <span v-if="node.address.postcode">
          {{', ' +node.address.postcode}}
        </span>
        <span v-if="node.address.city">
          {{' ' + node.address.city}}
        </span>
        <span v-if="node.address.country">
          {{' ' + node.address.country}}
        </span>
      </div>
      <div class="section">
        Name:
        {{node.details.name}}
      </div>
    </div>

    <div class="note-success" v-if="isNote">
      <div class="success-title">Änderungen gespeichert</div>

      <div class="section">
        <a :href="note.link" target="_blank">Link zu OpenStreetMap</a>
      </div>
      <div class="section">
        Adresse: {{note.text.address}}
      </div>
      <div class="section">
        Name: {{note.text.name}}
      </div>
    </div>
  </div>

</template>

<script>
  import 'vue-awesome/icons'
  import Icon from 'vue-awesome/components/Icon.vue'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'post-success',
    computed: {
      ...mapGetters([
        'note',
        'node',
        'isNote',
        'displaySuccess',
        'hasUpdates'
      ])
    },
    methods: {
      ...mapMutations([
        'setDisplaySuccess',
        'setDetails'
      ]),
      toggleSuccess () {
        this.setDisplaySuccess(false)
      }
    },
    components: {
      Icon
    }
  }
</script>

<style scoped>
  .success-wrapper {
    position: fixed;
    z-index: 100;
    width: 500px;
    margin-left: -250px;
    bottom: 50px;
    left: 50%;
    background-color: white;
    border: 2px solid #7ebc6f;
    padding: 12px;
    font-size: 16px;
  }

  .section {
    margin-bottom: 6px;
    text-align: left;
  }

  .success-title {
    font-weight: bold;
    text-align: left;
    margin-bottom: 5px;
    font-size: 18px;
  }

  .success-button {
    float: right;
    cursor: pointer;
  }
</style>
