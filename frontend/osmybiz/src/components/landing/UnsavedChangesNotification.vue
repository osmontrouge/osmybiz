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
          <i18n path="unsavedchanges.section">
            <strong place="time">{{ timeLeft }}</strong>
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
  import { UNSAVEDCHANGESTIME } from '../../pages/detailPage.vue';
  
  export default {
    name: 'unsaved-changes-notification',
    data() {
      return {
        time: UNSAVEDCHANGESTIME,
      };
    },
    computed: {
      ...mapGetters([
        'displayUnsavedChangesNotification',
      ]),
      timeLeft() {
        setTimeout(() => {
          this.time = this.time - 1;
        }, 1000);
        return this.time;
      },
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
