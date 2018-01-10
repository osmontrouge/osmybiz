<template>
  <div class="form-footer">
    <button class="button"
            @click="back()">
      {{t('detail').buttons.back}}</button>
    <button class="button"
            id="reset-button"
            @click="reset()">
      {{t('detail').buttons.reset}}</button>
    <button class="button"
            :disabled="isRequiredFields() || isDuplicate || hasNoChanges()"
            @click="submit()">
      {{t('detail').buttons.save}}</button>
  </div>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import { routes } from '../../router/index';
  import { clearDetails } from '../../store/detail';

  export default {
    name: 'form-footer',
    computed: {
      ...mapGetters([
        'isNote',
        'isOwnCategory',
        'details',
        'address',
        'user',
        'osmId',
        'lat',
        'lon',
        'isDuplicate',
      ]),
    },
    methods: {
      ...mapMutations([
        'setDetails',
        'setAddress',
        'setIsDuplicate',
        'setIsConfirm',
      ]),
      ...mapActions([
        'postSelectedCategoryNote',
        'postOwnCategoryNote',
        'postNode',
        'checkDuplicateNode',
        'getConfirmation',
        'loadUpdates',
      ]),
      submit() {
        let promise;
        if (this.isNote && !this.isOwnCategory) {
          promise = this.postSelectedCategoryNote({ user: this.user, osmId: this.osmId })
            .then(() => true);
        } else if (this.isOwnCategory) {
          promise = this.postOwnCategoryNote().then(() => true);
        } else {
          promise = this.checkDuplicateNode().then((res) => {
            if (!res) {
              return this.postNode(this.user).then(() => true);
            }
            return false;
          });
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
      hasNoChanges() {
        const details = JSON.parse(localStorage.getItem('details'));
        const address = JSON.parse(localStorage.getItem('address'));
        return JSON.stringify(details) === JSON.stringify(this.details) &&
          JSON.stringify(address) === JSON.stringify(this.address);
      },
      reset() {
        this.getConfirmation(() => {
          const details = JSON.parse(localStorage.getItem('details'));
          const address = JSON.parse(localStorage.getItem('address'));
          const category = {
            text: details.category.text,
            fields: details.category.fields,
            value: details.category.value,
          };
          if (this.details.category.text === details.category.text) {
            this.details.category.fields.forEach((field, index) => {
              category.fields[index].label = field.label;
            });
          }
          details.category = category;
          this.setDetails(details);
          this.setAddress(address);
          this.setIsConfirm(false);
        });
      },
      back() {
        this.getConfirmation(() => {
          this.$router.push({ name: routes.Landing });
          this.setIsConfirm(false);
        });
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
