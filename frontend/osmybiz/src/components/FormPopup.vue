<template>
  <div>
    <div class="popup" id="popup">
      <span>{{infoText}}</span>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'form-popup',
    mounted () {
      let popup = document.getElementById('popup')
      window.onmousemove = function (e) {
        let x = e.clientX
        let y = e.clientY
        popup.style.top = (y + 10 + window.scrollY) + 'px'
        popup.style.left = (x + 10) + 'px'
      }
    },
    computed: {
      ...mapGetters([
        'infoText'
      ])
    }
  }
</script>

<style scoped>
  .popup {
    background: #7ebc6f;
    display: block;
    position: absolute;
    z-index: 100;
    width: 25%;
    color: white;
    padding: 10px;
  }
</style>
