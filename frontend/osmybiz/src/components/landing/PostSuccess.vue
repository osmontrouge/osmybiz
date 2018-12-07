<template>

  <div class="dialog" id="success-dialog" v-if="successMessage.address">
    <div class="close-button" @click="toggleSuccess">
      <icon name="window-close"></icon>
    </div>

    <div class="node-success">
      <div class="dialog-title" v-if="successMessage.isNote">
        {{ $t('success.note.title') }}
      </div>
      <div class="dialog-title" v-else>
        {{ $t('success.businessPOI.title') }}
      </div>

      <div class="section">
        <a :href="successMessage.link"
           class="external-link"
           target="_blank">
          {{ $t('success.link') }}
          <icon class="link-icon" name="external-link-alt"></icon>
        </a>
      </div>

      <div class="section">
        {{ $t('success.address') }}:
        {{successMessage.address}}
      </div>

      <div class="section">
        {{ $t('success.name') }}:
        {{successMessage.name}}
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
        'successMessage',
      ]),
    },
    methods: {
      ...mapMutations([
        'setSuccessMessage',
      ]),
      hideMessage() {
        this.setSuccessMessage('');
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
