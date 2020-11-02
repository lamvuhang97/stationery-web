<template>
  <div class="error-wrapper">
    <h3>Internal Error</h3>
    <h4>Try refreshing the page</h4>
    <p v-if="errorText !== ''">{{ errorText }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'InternalError',
  props: {
    errorText: {
      type: String,
      default: '',
    },
  },
})
</script>

<style lang="scss" scoped>
.error-wrapper {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  margin: 20px;
}
</style>
