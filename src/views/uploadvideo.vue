<template>
  <div>
    <custom-form 
        :formbuilder="formbuilder" 
        recordId="" 
        @form-save-click="save"
        ></custom-form>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import { isValidDocumentLabel } from "../library/validators";
import { settings } from "@/library/variables";
import Vue from "vue";
export default {
  name: "DocumentsCRUD",
  data() {
    return {
      file: undefined,
      title: '',
      uploadProgress: 0,
      maxUpload: 0,
      error: false,
      formbuilder: {
        heading: "Upload video file",
        columns: [
          {
            label: "Video File Id",
            field: "idvideo",
            value: "",
            inputtype: true,
            validate: {
              required, isValidDocumentLabel
            },
            placeholder: "Enter a unique video id"
          },
          {
            upvideotype: true,
            field: "uploadvideo",
            label: "",
            buttonText: "Select video file",
            rawVideoData: this.file,
            action: this.uploadVideo,
          }
        ],
        disabledSave: false,
        isLoading: false,
        buttonsavelabel: "Upload Video File",
        optionDisabled: false,
        reloadFormbuilder: true
      },
    };
  },
  methods: {
    async save(params) {
      if(this.file == '' || this.file == undefined) {
        this.$toasted.error("Video empty");
        return 
      } else {
      this.fileSize = this.file.size
      this.chunkSize = 1024 * 1024
      this.offset = 0
      const f = new FormData()
      f.append('file', this.file)
      try {
        await this.$axios({
          method: 'post',
          url: Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + '/videos/raw-sources/' + params.idvideo + '.mp4',
          data: this.file,
          headers: {
            'Content-Type': 'video/mp4',
          }
        })
        this.$router.push({ name: "VideosCreate" });
      } catch (error) {
        this.error = true
        this.uploadProgress = 0
        this.maxUpload = 0
      }
      }
      
    },
    uploadVideo(evt) {
        this.reloadFormbuilder = false
        this.file = evt.target.files[0]
    }
  },

  async mounted() {
  }
}
</script>