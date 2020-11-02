<template>
  <div class="wrapper">
    <div class="inner">
      <h2>Upload Video File</h2>
      <form class="upload-media-form">
        <div class="field-form">
          <label for="title">Video File Id<span class="required">*</span></label>
          <input
            id="title"
            v-model="title"
            name="title"
            type="text"
            placeholder="Enter a unique video id"
            class="input"
            required
            @keypress="filterLabelChars"
          />
          <span class="help-info">Please only use lowercase letters, numbers and '-'</span>
        </div>
        <label v-if="!titleValid">Name must not contain spaces</label>
        <br />
        <div class="form-field">
          <label for="mediaUploadButton">Select video file<span class="required">*</span></label>
          <upload-file button-text="Select Video File" @updateFile="fileUpload" />
        </div>
        <div class="form-field">
          <button
            id="mediaUploadButton"
            class="button"
            :disabled="!titleValid || file === undefined || uploadProgress !== maxUpload || titleEmpty"
            @click.prevent="sendFile"
          >
            Upload Video File
          </button>
        </div>
        <p v-if="error">Error uploading video</p>
        <progress v-if="uploadProgress !== maxUpload" :value="uploadProgress" :max="maxUpload"></progress>
        <span v-if="uploadProgress !== maxUpload">Uploading ...</span>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import UploadFile from '@/components/global/UploadFile.vue'

export default Vue.extend({
  name: 'UploadMedia',
  components: {
    UploadFile,
  },
  data() {
    return {
      title: '',
      file: undefined,
      uploadProgress: 0,
      maxUpload: 0,
      error: false,
    } as {
      title: string
      file: File | undefined
      uploadProgress: number
      maxUpload: number
      error: boolean
    }
  },
  computed: {
    currentProperty() {
      return this.$store.getters['properties/getCurrentProperty']
    },
    titleValid() {
      return !this.title.includes(' ')
    },
    titleEmpty() {
      return this.title === ''
    },
  },
  watch: {
    type() {
      if (this.type === null) {
        this.type = 'VOD'
      }
    },
  },
  mounted() {},
  methods: {
    filterLabelChars($event) {
      // this allows lowercase letters, numbers and '-'
      // ^ to $ delimits the string
      // the chars in the [] are ranges that are or'd together
      if (!$event.key.match(/^[0-9a-z-]+$/)) {
        $event.preventDefault()
      }
    },
    fileUpload(f) {
      this.file = f.target.files[0]
    },
    async sendFile() {
      this.fileSize = this.file.size
      this.chunkSize = 1024 * 1024
      this.offset = 0
      const f = new FormData()
      f.append('file', this.file)
      try {
        await this.$axios({
          method: 'post',
          url: '/api/properties/' + this.currentProperty.id + '/videos/raw-sources/' + this.title + '.mp4',
          data: this.file,
          headers: {
            'Content-Type': 'video/mp4',
          },
          onUploadProgress: (event: ProgressEvent) => {
            this.maxUpload = event.total
            this.uploadProgress = event.loaded
          },
        })
        this.$router.push('/' + this.currentProperty.id + '/videos/new')
      } catch (error) {
        this.error = true
        this.uploadProgress = 0
        this.maxUpload = 0
      }

      //   this.readChunk(this.offset, this.chunkSize, this.$refs.fupload.files[0])
    },
  },
})
</script>
<style lang="scss" scoped>
.help-info {
  padding: 8px;
  font-size: smaller;
  font-style: italic;
  color: #333;
  text-align: center;
}
</style>
