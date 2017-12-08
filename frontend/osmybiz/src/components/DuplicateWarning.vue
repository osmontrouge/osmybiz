<template>

  <div class="duplicate-wrapper" v-if="isDuplicate">
    <div class="close-button" @click="toggle">
      <icon name="window-close"></icon>
    </div>
    <div class="node-warning" v-if="!isNote">
      <div class="warning-title">{{t('warning').duplicate.node.title}}</div>
      <div class="section">
        {{t('warning').duplicate.node.section1}}
      </div>
      <div class="section">
        {{t('warning').duplicate.node.section2}}
      </div>
    </div>

    <div class="note-warning" v-if="isNote">
      <div class="warning-title">{{t('warning').duplicate.note.title}}</div>
      <div class="section">
        {{t('warning').duplicate.note.section1}}
      </div>
      <div class="section">
        {{t('warning').duplicate.note.section2}}
        <a :href="noteLink" target="_blank">{{t('warning').duplicate.note.comment}}</a>
      </div>
    </div>
  </div>

</template>

<script>
  import 'vue-awesome/icons'
  import Icon from 'vue-awesome/components/Icon.vue'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'duplicate-warning',
    computed: {
      ...mapGetters([
        'isNote',
        'isDuplicate',
        'noteLink'
      ])
    },
    methods: {
      ...mapMutations([
        'setIsDuplicate'
      ]),
      toggle () {
        this.setIsDuplicate(false)
      }
    },
    components: {
      Icon
    }
  }
</script>

<style scoped>
  .duplicate-wrapper {
    position: fixed;
    z-index: 100;
    width: 500px;
    margin-left: -250px;
    bottom: 65px;
    left: 50%;
    background-color: white;
    border: 2px solid red;
    padding: 12px;
    font-size: 16px;
    overflow-y: auto;
  }

  .section {
    margin-bottom: 6px;
    text-align: left;
  }

  .warning-title {
    font-weight: bold;
    text-align: left;
    margin-bottom: 5px;
    font-size: 18px;
  }

  .close-button {
    float: right;
    cursor: pointer;
  }
</style>
