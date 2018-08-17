<template>
  <l-popup
    ref="popup"
    :content="content"
    :lat-lng="latLng"
    :options="options"
    @popupclose="popupWasClosed"
  ><slot></slot>
  </l-popup>
</template>

<script>
  import { LPopup } from 'vue2-leaflet';

  const props = {
    content: {
      default: '',
    },
    latLng: {
      type: [Object, Array],
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  };

  export default {
    name: 'VPopupOpen',
    props,
    components: {
      LPopup,
    },
    mounted() {
      this.$refs.popup.mapObject.openOn(this.$refs.popup.parentContainer.mapObject);
    },
    methods: {
      popupWasClosed() {
        this.$refs.popup.mapObject.openOn(this.$refs.popup.parentContainer.mapObject);
        return false;
      },
    },
  };
</script>
