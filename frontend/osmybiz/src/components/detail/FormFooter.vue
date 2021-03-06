<template>
  <div class="form-footer">
    <button class="button"
            @click="back()">
      {{ $t('detail.buttons.back') }}</button>
    <button class="button"
            id="reset-button"
            @click="reset()">
      {{ $t('detail.buttons.reset') }}</button>
    <button class="button"
            :disabled="isRequiredFields() || isDuplicate || isNotModified(this)"
            @click.once="submit()">
      {{ message }}</button>
  </div>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import { routes } from '../../router/index';
  import { clearDetails, isNotModified } from '../../store/detail';

  export default {
    name: 'form-footer',
    data() {
      return {
        message: this.$t('detail.buttons.save'),
      };
    },
    computed: {
      ...mapGetters([
        'isNote',
        'isOwnCategory',
        'details',
        'address',
        'user',
        'osmId',
        'osmType',
        'lat',
        'lon',
        'isDuplicate',
        'noteId',
      ]),
    },
    methods: {
      ...mapMutations([
        'setDetails',
        'setAddress',
        'setIsDuplicate',
        'setIsConfirm',
        'setIsFormSubmission',
      ]),
      ...mapActions([
        'postNote',
        'postOwnCategoryNote',
        'postNode',
        'checkDuplicateBusinessPOI',
        'getConfirmation',
        'loadUpdates',
      ]),
      submit() {
        this.message = this.$t('detail.buttons.pleasewait');
        let promise;
        this.setIsFormSubmission(true);
        if (!this.isNote && !this.isOwnCategory) {
          promise = this.checkDuplicateBusinessPOI().then((res) => {
            if (!res) {
              return this.postNode(this.user).then(() => true);
            }
            return false;
          });
        } else {
          promise = this.postNote({
            user: this.user,
            osmId: this.osmId,
            noteId: this.noteId,
            osmType: this.osmType,
          }).then(() => true);
        }
        promise.then((success) => {
          if (success) {
            this.loadUpdates(this.user);
            this.$router.push({ name: routes.Landing });
            clearDetails();
          }
        });
      },
      isRequiredFields() {
        return this.details.category.text === '' ||
          (this.address.street === '' && this.address.place === '') ||
          this.address.postcode === '' ||
          this.address.city === '' ||
          this.address.country === '' ||
          this.details.name === '';
      },
      reset() {
        this.getConfirmation(() => {
          const details = JSON.parse(localStorage.getItem('details'));
          const address = JSON.parse(localStorage.getItem('address'));
          this.setDetails(details);
          this.setAddress(address);
          this.setIsConfirm(false);
        });
      },
      isNotModified,
      back() {
        this.$router.push({ name: routes.Landing });
      },
    },
  };
</script>

<style scoped>
  .form-footer {
    position: fixed;
    height: 60px;
    margin: 0 auto;
    max-width: 1000px;
    bottom: 0;
    background: white;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: flex-start;
    left: 0;
    right: 0;
  }

  .button {
    flex-grow: 1;
    margin: 10px 0;
  }

  #reset-button {
    margin: 10px;
  }
</style>
