<template>
  <div class="modal-background" @click="$emit('no')">
    <div class="modal-content">
      <div class="modal-body" @click.stop>
        <div class="modal-header">
          <div v-if="isView === true" class="modal-body">
            <p class="modal-heading">
              <font-awesome-icon title="Warning" :icon="['fas', 'exclamation-circle']" class="warning-emphasis " />
              <strong class="warning-emphasis">Warning:</strong> Editing view labels can break apps.
            </p>
            Labels are used to identify views in native apps
            <br />
            <br />
            Editing a view's label which an app expects to exist will keep it from appearing until the app has been
            updated, re-released and reinstalled on each subscriber's device.
            <br />
            <br />
            Are you sure you want to edit this label?
          </div>
          <div v-if="isView === false" class="modal-body">
            <p class="modal-heading">
              <font-awesome-icon title="Warning" :icon="['fas', 'exclamation-circle']" class="warning-emphasis" />
              <strong class="warning-emphasis">Warning:</strong> Editing labels can break links.
            </p>
            Labels are used to link videos and collections on the website.
            <br />
            <br />
            Editing a video or collection's label can impact search engine optimization or result in broken links.
            <br />
            <br />
            Are you sure you want to edit this label?
          </div>
        </div>
        <div class="form-field is-horizontal">
          <button class="button is-primary save-button" @click.stop="$emit('yes')">Yes</button>
          <a class="button is-primary save-button" @click.stop="$emit('no')">No</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LabelChanged',
  props: {
    isView: {
      type: Boolean,
      default: false,
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
    padding: 20px 40px 20px 20px;
    text-align: left;
    background-color: $white;
    border: 1px solid $black;

    .modal-body {
      width: 480px;
      margin-right: 50px;
      margin-left: 30px;

      .modal-header {
        margin-top: 40px;
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
  .warning-emphasis {
    font-size: x-large;
    color: #01baef;
  }
}
</style>
