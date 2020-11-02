<template>
  <span class="upload-container">
    <button class="btn btn-primary" @click.prevent="upload">{{ buttonText }}</button>
    <span ref="fileInputSlot" class="fileInput">
      <input id="imageButton" ref="uploadComponent" class="file-input" type="file" name="images" @change="emitChange" />
    </span>
    <p class="upload-file-name">{{ fileName }}</p>
  </span>
</template>

<script lang="ts">
// This component is to be used to unify styles of file upload buttons while
// allowing the parent component access to the file input html element.
//
// The component will click the first element in the slot, as such the
// file upload form should be in the slot.
//
// <upload-file> <input type="file"> </upload-file>
// It should be the only element in the slot, and it will be hidden.
//
// Props:
// button-text - The text to render on the button.
import Vue from 'vue'
export default Vue.extend({
  name: 'UploadFile',
  props: {
    buttonText: {
      type: String,
      default: 'Upload File',
    },
  },
  data() {
    return {
      fileName: '',
    }
  },
  methods: {
    upload() {
      this.$refs.uploadComponent.click()
    },
    emitChange(evt) {
      this.fileName = evt.target.files[0].name
      this.$emit('updateFile', evt)
    },
  },
})
</script>

<style lang="scss" scoped>
.fileInput {
  display: none;
  background: black;
}
.upload-container {
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
}

.upload-file-name {
  margin-left: 10px;
}
</style>
