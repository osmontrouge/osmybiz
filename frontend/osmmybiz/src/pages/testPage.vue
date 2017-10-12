<template>

  <div>
    <div v-for="i in all">
      <span class="item">{{ i.name }}</span>
      <span class="remove" @click="remove(i)">x</span>
    </div>

    <input v-model="newItemText">

    <button :disabled="!canAdd" @click="newItem()">
      New
    </button>

    <button @click="login()">
          Login
    </button>

  </div>


</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {

    mounted () {
      this.load()
    },
    computed: {
      ...mapGetters([
        'all',
        'nextId',
        'text',
        'canAdd'
      ]),
      newItemText: {
        get () { return this.text },
        set (value) { this.setText(value) }
      }
    },
    methods: {
      ...mapActions([
        'load',
        'login'
      ]),
      ...mapMutations([
        'add',
        'setText',
        'remove'
      ]),
      newItem () {
        if (this.canAdd) {
          this.add({id: this.nextId, name: this.text})
          this.setText('')
        }
      },
      login () {
        this.login()
      }
    }
  }
</script>

<style>

  .remove {
    font-size: 20px;
    color: red;
    cursor: pointer;
  }

  .item {
    font-size: 20px;
  }

</style>
