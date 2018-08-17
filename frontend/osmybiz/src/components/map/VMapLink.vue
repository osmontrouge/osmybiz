<template>
  <div class="popup-link">
    <a :href="link" target="_blank"><slot></slot><icon class="link-icon" name="external-link-alt"></icon></a>
  </div>
</template>
<script>
  import 'vue-awesome/icons';
  import Icon from 'vue-awesome/components/Icon.vue';

  export default {
    name: 'v-map-link',
    props: {
      link: {
        type: String,
        required: true,
      },
    },
    components: {
      Icon,
    },
  };
</script>
<style>
  .popup-link {
    cursor: pointer;
    text-decoration: underline;
  }
</style>
