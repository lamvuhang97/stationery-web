<template>
  <div class="modal-background" @click="$emit('no')">
    <div class="modal-content">
      <div class="modal-body" @click.stop>
        <div class="modal-header">
          <p v-if="text === undefined" class="modal-heading">
            You have unsaved changes. Leave the page without saving them?
          </p>
          <p v-if="text !== undefined" class="modal-heading">{{ text }}</p>
        </div>
        <br />
        <div class="form-field is-horizontal">
          <nuxt-link v-if="to !== undefined" class="button is-primary save-button" :to="to">Yes</nuxt-link>
          <a v-if="to === undefined" class="button is-primary save-button" @click.prevent="$emit('yes')">Yes</a>
          <a class="button is-primary save-button" @click.stop="$emit('no')">No</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AreYouSure',
  props: {
    to: {
      type: String,
      required: false,
      default: undefined,
    },
    text: {
      type: String,
      required: false,
      default: undefined,
    },
  },
})
</script>
<style lang="scss">
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #0004;

  .modal-content {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    min-width: 400px;
    min-height: 200px;
    text-align: center;
    background-color: $white;
    border: 1px solid $black;

    .modal-body {
      width: 100%;

      .modal-header {
        margin-top: 50px;
        margin-right: 10px;
        margin-left: 10px;
      }
    }
  }

  .form-field.is-horizontal {
    display: flex;
    flex-flow: row;
    justify-content: space-around;

    .button {
      width: 100px;
    }
  }
}
</style>
