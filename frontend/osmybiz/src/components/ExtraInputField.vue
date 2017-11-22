<template>
  <div>
    <input v-if="checkType()==='text'"
           type="text"
           v-model="field.value"/>
    <input v-if="checkType()==='number'"
           type="number"
           v-model="field.value"/>
    <input v-if="checkType()==='check'"
           type="checkbox"
           v-model="field.value"/>
    <input v-if="checkType()==='radio'"
           type="radio"
           v-model="field.value"/>
    <select v-if="checkType()==='combo'"
            v-model="field.value">
      <option v-for="option in field.options" v-bind:value="option.value">
        {{option.text}}
      </option>
    </select>
  </div>
</template>

<script>
    export default {
      name: 'extra-input-field',
      props: ['field'],
      methods: {
        checkType () {
          if (this.field.type === 'text' ||
            this.field.type === 'check' ||
            this.field.type === 'number' ||
            this.field.type === 'combo' ||
            this.field.type === 'radio') {
            return this.field.type
          } else {
            return 'text'
          }
        }
      }
    }
</script>

<style scoped>

</style>
