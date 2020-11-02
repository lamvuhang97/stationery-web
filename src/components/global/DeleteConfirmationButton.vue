<template>
  <div class="delete-button-wrapper">
    <h3>{{ labelText }}</h3>

    <div class="form-field">
      <label class="checkbox inline" for="delete-content">
        <input
          id="delete-content"
          v-model="shouldDeleteContent"
          type="checkbox"
          name="delete-content"
          :value="checkboxText"
        />
        {{ checkboxText }}
      </label>
    </div>

    <div class="form-field">
      <button
        id="delete"
        name="delete"
        :disabled="!shouldDeleteContent"
        class="button is-danger"
        @click.prevent="$emit('deleteContent')"
      >
        {{ buttonText }}
      </button>

      <p v-if="shouldDeleteContent" class="help is-danger">
        {{ helpText }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'DeleteConfirmationButton',
  props: {
    labelText: {
      type: String,
      default: 'Delete Content',
    },
    checkboxText: {
      type: String,
      default: 'I would like to delete this content',
    },
    helpText: {
      type: String,
      default: 'Clicking the delete button will permanently delete the content.',
    },
    buttonText: {
      type: String,
      default: 'Delete',
    },
  },
  data() {
    return {
      shouldDeleteContent: false,
    } as {
      shouldDeleteContent: boolean
    }
  },
})
</script>

<style lang="scss" scoped>
.delete-button-wrapper {
  margin-top: 35px;
}

.button {
  margin-top: 15px;
  background: $red;
  &:hover {
    color: $white;
    background: $darkred;
  }
  &:disabled:hover {
    background: $lightred;
  }
}
</style>
