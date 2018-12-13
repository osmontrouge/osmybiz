<template>
  <div>
    <div class="popup" id="popup">
      <span>{{infoText}}</span>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'form-popup',
    mounted() {
      const popup = document.getElementById('popup');
      window.onmousemove = (e) => {
        const x = e.clientX;
        const y = e.clientY;
        popup.style.top = `${y + 10 + window.scrollY}px`;
        if (this.xOffset) {
          popup.style.left = `${x + parseInt(this.xOffset, 10)}px`;
          // overrides the width property as well
          popup.style.width = `${(-1 * parseInt(this.xOffset, 10)) - 10}px`;
        } else {
          popup.style.left = `${x + 10}px`;
        }
      };
    },
    computed: {
      ...mapGetters([
        'infoText',
      ]),
    },
    props: ['xOffset'],
  };
</script>

<style lang="scss">

  @import "../../scss/globals";

  .popup {
    background: $primary-color;
    display: block;
    position: absolute;
    z-index: 100;
    width: 25%;
    color: white;
    padding: 10px;
  }
</style>
