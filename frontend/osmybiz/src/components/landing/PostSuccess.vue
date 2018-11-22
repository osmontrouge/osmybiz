<template>

  <div class="dialog" id="success-dialog" v-if="displaySuccess">
    <div class="close-button" @click="toggleSuccess">
      <icon name="window-close"></icon>
    </div>

    <div class="node-success" v-if="!isNote">
      <div class="dialog-title">
        {{ $t('success.businessPOI.title') }}
      </div>

      <div class="section">
        <a :href="businessPOI.link"
           class="external-link"
           target="_blank">
          {{ $t('success.link') }}
          <icon class="link-icon" name="external-link-alt"></icon>
        </a>
      </div>

      <div class="section">
        {{ $t('success.address') }}:
        <span v-if="businessPOI.address.street">
              {{businessPOI.address.street}}
              <span v-if="!businessPOI.address.housenumber">
                {{', '}}
              </span>
              <span v-if="businessPOI.address.housenumber">
                {{' ' + businessPOI.address.housenumber  + ', '}}
              </span>
            </span>
        <span v-if="businessPOI.address.place">
              {{businessPOI.address.place + ', '}}
            </span>
        <span v-if="businessPOI.address.postcode">
                {{businessPOI.address.postcode}}
            </span>
        <span v-if="businessPOI.address.city">
                {{' ' + businessPOI.address.city}}
            </span>
        <span v-if="businessPOI.address.country">
                {{' ' + businessPOI.address.country}}
            </span>
      </div>
      <div class="section">
        {{ $t('success.name') }}:
        {{businessPOI.details.name}}
      </div>
    </div>

    <div class="note-success" v-if="isNote">
      <div class="dialog-title">
        {{ $t('success.note.title') }}
      </div>
      <div class="section">
        <a :href="note.link"
           class="external-link"
           target="_blank">
          {{ $t('success.link') }}
          <icon class="link-icon" name="external-link-alt"></icon>
        </a>
      </div>

      <div class="section">
        {{ $t('success.address') }}:
        {{note.text.address}}
      </div>

      <div class="section">
        {{ $t('success.name') }}:
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
        'businessPOI',
        'isNote',
        'displaySuccess',
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
