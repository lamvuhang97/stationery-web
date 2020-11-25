<template>
    <div class="product-crud container">
        <div class="infor">
            <custom-form :formbuilder="formbuilder" @form-save-click="save"></custom-form>
        </div>
        <div class="image">
            <div class="title">
                <h4>Hinh anh san pham</h4>
                <span>Them hinh anh se giup cho san pham cua ban tiep can khach hang de dang hon</span>
            </div>
            <vue-upload-multiple-image
                @upload-success="uploadImageSuccess"
                @before-remove="beforeRemove"
                @edit-image="editImage"
                @data-change="dataChange"
                :data-images="images"
            ></vue-upload-multiple-image>
        </div>
    </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import VueUploadMultipleImage from 'vue-upload-multiple-image'
import firebase from 'firebase';
export default {
    components: {
        VueUploadMultipleImage,
    },
    data() {
        return {
            categoryList: [],
            images: [],
            imageFormData: [],
            imgUrlArr: [],
            imgUrlToPost: [],
            formbuilder: {
            heading: "Thong tin san pham",
            columns: [
                {
                    label: "Ten san pham",
                    field: "name",
                    value: "",
                    filterable: true,
                    inputtype: true,
                    placeholder: "",
                    validate: {
                        required
                    }
                },
                {
                    label: "Phan loai",
                    multiselecttype: true,
                    field: "category",
                    placeholder: "",
                    options: [],
                    labelBy: 'name'
                },
                {
                    label: "Gia",
                    field: "price",
                    value: "",
                    filterable: true,
                    inputemail: true,
                    placeholder: "",
                    validate: {
                        required,
                    }
                },
                {
                    label: "So luong kho",
                    field: "quantity",
                    value: "",
                    filterable: true,
                    inputtype: true,
                    placeholder: ""
                },
                {
                    label: "Mo ta san pham",
                    field: "description",
                    value: "",
                    filterable: true,
                    textarea: true,
                    rows: 5,
                    placeholder: ""
                },
                
            ],
            disabledSave: false,
            isLoading: false,
            buttonsavelabel: "Save",
            reloadFormbuilder: true
        },
        productToPost : {}
        }
    },
    async beforeMount() {
        var res = await this.$api.category.getAllCategory()
        console.log(res);
        res.data.data.rows.forEach((item) => {
            this.categoryList.push({
                name: item.name,
                id: item.id
            })
        })
    },
    mounted() {
        this.formbuilder.columns[1].options = this.categoryList

    },
    methods: {
        async save(params) {
            var pId = 0
            this.productToPost = {
                name : params.name,
                categoryId: params.category.id,
                price: params.price,
                quantity: params.quantity,
                description: params.description,
                status: true
            }
            await this.$api.products.createProduct(this.productToPost)
            .then(res => {
                pId = res.data.id
            })
            this.imgUrlArr.forEach((item) => {
                this.create(item)
            })

            // upload url to image table 
            this.imgUrlToPost.forEach(async(item) => {
                await this.$api.products.postImageUrl({url : item})
                .then(async res => {
                    await this.$api.products.postProductImage({productId : pId, imageId: res.data.id})
                    .then(res => {
                        console.log("res up  product img", res);
                    })
                })
            })

        
        },
        uploadImageSuccess(formData, index, fileList) {
            console.log('data', formData, index, fileList)
            this.imageFormData = fileList

            var uploadValue
            this.imgUrlArr=[];
            formData.forEach((item) => {
                const storageRef=firebase.storage().ref(`${item.name}`).put(item);
                storageRef.on(`state_changed`,snapshot=>{
                    uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                }, error=>{console.log(error.message)},
                ()=>{
                    uploadValue=100;
                    console.log(uploadValue);
                    storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                            this.imgUrlArr.push(url)
                        });
                    }      
                );
            })
            
        },
        create(imgUrl) {
            const post = {
                photo: imgUrl,        
            }
            this.imgUrlToPost.push(post.photo)
            firebase.database().ref('PhotoGallery').push(post)
            .then((response) => {
            console.log(response);
            })
            .catch(err => {
            console.log(err)
            })
        },
        beforeRemove (index, done, fileList) {
            console.log('index', index, fileList)
            // var r = confirm("remove image")
            var r = true
            if (r == true) {
                done()
            }
        },
        editImage (formData, index, fileList) {
            console.log('edit data', formData, index, fileList)
        },
        dataChange (data) {
            console.log("kasdi",data)
            
        }
    }
}
</script>
<style scoped>
.product-crud {
    display: flex;
}
.infor {
    width: 65%;
    padding-right: 20px;
}
.image .title {
    max-width: 300px;
    padding-right: 20px;
}

/* css for multi input image*/

.image-list-container {
        max-width: 100%;
}
.image-list-container .image-list-item{
    height: 70px;
    width: 70px;
}

.image-list-container .image-list-item .centered img {
        max-width: 60px;
    max-height: 60px;
}
</style>