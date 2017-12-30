<template>

  <div class="dialog" id="success-dialog" v-if="displaySuccess">
    <div class="close-button" @click="toggleSuccess">
      <icon name="window-close"></icon>
    </div>

    <div class="node-success" v-if="!isNote">
      <div class="dialog-title">
        {{t('success').node.title}}
      </div>

      <div class="section">
        <a :href="node.link"
           class="external-link"
           target="_blank">
          {{t('success').link}}
          <icon class="link-icon" name="external-link"></icon>
        </a>
      </div>

      <div class="section">
        {{t('success').address}}:
        <span v-if="node.address.street">
              {{node.address.street}}
              <span v-if="!node.address.housenumber">
                {{', '}}
              </span>
              <span v-if="node.address.housenumber">
                {{' ' + node.address.housenumber  + ', '}}
              </span>
            </span>
        <span v-if="node.address.place">
              {{node.address.place + ', '}}
            </span>
        <span v-if="node.address.postcode">
                {{node.address.postcode}}
            </span>
        <span v-if="node.address.city">
                {{' ' + node.address.city}}
            </span>
        <span v-if="node.address.country">
                {{' ' + node.address.country}}
            </span>
      </div>
      <div class="section">
        {{t('success').name}}:
        {{node.details.name}}
      </div>
    </div>

    <div class="note-success" v-if="isNote">
      <div class="dialog-title">
        {{t('success').note.title}}
      </div>
      <div class="section">
        <a :href="note.link"
           class="external-link"
           target="_blank">
          {{t('success').link}}
          <icon class="link-icon" name="external-link"></icon>
        </a>
      </div>

      <div class="section">
        {{t('success').address}}:
        {{note.text.address}}
      </div>

      <div class="section">
        {{t('success').name}}:
        {{note.text.name}}
      </div>
    </div>
  </div>

</template>

<script>
  import 'vue-awesome/icons';
  import Icon from 'vue-awesome/components/Icon.vue';
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'post-success',
    computed: {
      ...mapGetters([
        'note',
        'node',
        'isNote',
        'displaySuccess',
        'hasUpdates',
      ]),
    },
    methods: {
      ...mapMutations([
        'setDisplaySuccess',
        'setDetails',
      ]),
      toggleSuccess() {
        this.setDisplaySuccess(false);
      },
    },
    components: {
      Icon,
    },
  };
</script>

<style scoped>

  #success-dialog {
    width: 500px;
    margin-left: -250px;
    bottom: 65px;
    left: 50%;
    border: 2px solid #7ebc6f;
    padding: 12px;
    font-size: 16px;
  }

</style>
