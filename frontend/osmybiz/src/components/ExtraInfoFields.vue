<template>
  <div class="extra-wrapper">
    <div v-if="details.category.fields && details.category.fields.length > 0 && details.category.fields[0].name !== ''">
      <h3>{{t('detail').titles.extras}}</h3>
      <div class="extra-fields">
        <div class="column">
          <div class="field"
               v-for="field in details.category.fields.slice(details.category.fields.length/2, details.category.fields.length)">
            <label>{{ field.label }}</label>
            <extra-input-field :field="field"></extra-input-field>
          </div>
        </div>
        <div class="column">
          <div class="field"
               v-for="field in details.category.fields.slice(0, details.category.fields.length/2)">
            <label>{{ field.label }}</label>
            <extra-input-field :field="field"></extra-input-field>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import ExtraInputField from '../components/ExtraInputField'

  export default {
    name: 'extra-info-fields',
    components: {
      ExtraInputField
    },
    computed: {
      ...mapGetters([
        'details'
      ])
    }
  }
</script>

<style scoped>

  .extra-wrapper {
    border-top: 1px solid #7ebc6f;
    margin: 0 10% 0;
    width: 80%;
  }

  .extra-wrapper h3 {
    margin-top: 10px;
  }

  .extra-fields {
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: stretch;
  }

</style>
