<template>

  <div class="dialog" id="error-dialog" v-if="isShowUnsavedChangesNotification">
    <div class="node-success">
      <div class="dialog-title">
        {{ $t('unsavedchanges.title') }}
        <div class="close-button" @click="toggleSuccess">
         <icon name="window-close"></icon>
        </div>
      </div>

      <div id="error-section" class="section">
        <p>
          <i18n path="unsavedchanges.section">
            <strong place="time">{{ showDialogTimeLeft }}</strong>
            <a place="here" href="" @click.prevent="edit()">
              {{ $t('unsavedchanges.here') }}
            </a>
          </i18n>
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
        'isShowUnsavedChangesNotification',
        'showDialogTimeLeft',
        'timer',
      ]),
    },
    methods: {
      ...mapMutations([
        'setIsShowUnsavedChangesNotification',
        'setIsEditingUnsavedChanges',
        'restoreDetailState',
      ]),
      toggleSuccess() {
        this.setIsShowUnsavedChangesNotification(false);
      },
      edit() {
        clearInterval(this.timer);
        this.restoreDetailState();
        this.setIsEditingUnsavedChanges(true);
        this.$router.push({ name: routes.Detail });
      },
    },
    components: {
      Icon,
    },
  };
</script>
