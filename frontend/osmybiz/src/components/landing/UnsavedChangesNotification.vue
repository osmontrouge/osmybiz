<template>

  <div class="dialog" id="error-dialog" v-if="displayUnsavedChangesNotification">
    <div class="node-success">
      <div class="dialog-title">
        {{ $t('unsavedchanges.title') }}
        <div class="close-button" @click="toggleSuccess">
         <icon name="window-close"></icon>
        </div>
      </div>

      <div id="error-section" class="section">
        <p>
          You have some unsaved changes, click
          <a href="" v-on:click.prevent="edit()">
            here
          </a>
          to recover the changes.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import 'vue-awesome/icons';
  import Icon from 'vue-awesome/components/Icon.vue';
  import { mapGetters, mapMutations } from 'vuex';
  import { routes } from '../../router';

  export default {
    name: 'unsaved-changes-notification',
    computed: {
      ...mapGetters([
        'displayUnsavedChangesNotification',
      ]),
    },
    methods: {
      ...mapMutations([
        'setDisplayUnsavedChangesNotification',
        'setDetails',
        'setCoords',
        'setIsNote',
        'setAddress',
        'setOsmId',
        'setIsEditingUnsavedChanges',
      ]),
      toggleSuccess() {
        this.setDisplayUnsavedChangesNotification(false);
      },
      edit() {
        this.setIsEditingUnsavedChanges(true);
        this.$router.push({ name: routes.Detail });
      },
    },
    components: {
      Icon,
    },
  };
</script>
