<template>
    <div>
        <div>
            <upload-image @uploadImage="uploadImage"/>
        </div>
        <div>
            <h1>another components</h1>
        </div>
        <div>
            <button class="btn btn-success" @click="save">Save </button>
        </div>
    </div>
</template>
<script>
import UploadImage from '@/components/global/UploadImage.vue'
import firebase from 'firebase'
export default {
    data() {
        return {
            imgUrl: ''
        }
    },
    components:{
        UploadImage
    },
    methods: {
        uploadImage(params) {
            this.imgUrl = params
        },
        save() {
              const post = {
                photo: this.imgUrl,        
              }
              firebase.database().ref('PhotoGallery').push(post)
              .then((response) => {
                console.log(response)
              })
              .catch(err => {
                console.log(err)
              })
        }
    }
    
}
</script>