<template>
  <div class="extrainput-wrapper">
    <input v-if="checkType()==='text'"
           type="text"
           v-model="field.value"/>
    <input v-if="checkType()==='number'"
           type="number"
           v-model="field.value"/>
    <div v-if="checkType()==='check'">
      <div v-if="field.options"
           v-for="option in field.options"
           class="checkbox-wrapper">
        <label>{{option.text}}</label>
        <input type="checkbox"
               class="checkbox"
               v-model="field.value"/>
      </div>
      <div v-if="!field.options"
           class="checkbox-wrapper">
        <input type="checkbox"
               class="checkbox"
               v-model="field.value"/>
      </div>
    </div>
    <select v-if="checkType()==='combo'"
            v-model="field.value">
      <option></option>
      <option v-for="option in field.options" v-bind:value="option.key">
        {{option.text}}
      </option>
    </select>
  </div>
</template>

<script>
  export default {
    name: 'extra-input-field',
    props: ['field'],
    mounted() {
    },
    methods: {
      checkType() {
        if (this.field.type === 'text' ||
          this.field.type === 'check' ||
          this.field.type === 'number' ||
          this.field.type === 'combo') {
          return this.field.type;
        }
        if (this.field.type === 'radio') {
          return 'combo';
        }
        return 'text';
      },
    },
  };
</script>

<style scoped>
  .extrainput-wrapper {
    display: flex;
    justify-content: stretch;
  }

  input[type="text"], input[type="number"], select {
    width: 100%;
  }
</style>
