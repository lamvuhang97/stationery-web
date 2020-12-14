<template>
    <div class="product-crud container">
        <are-you-sure v-if="showDelModal" @no="showDelModal=false" @yes="deleteProduct"></are-you-sure>
        <div class="infor">
            <custom-form :formbuilder="formbuilder" @form-save-click="save"></custom-form>
            <button class="btn btn-danger" @click="showDelModal = true" v-if="$route.params.status == true">Xoa san pham</button>
        </div>
        <div class="image">
            <div class="title">
                <h4>Hình ảnh sản phẩm</h4>
                <span>Thêm hình ảnh sẽ giúp sản phẩm của bạn tiếp cận khách hàng dễ dàng hơn</span>
            </div>
            <vue-upload-multiple-image
                @upload-success="uploadImageSuccess"
                @before-remove="beforeRemove"
                @edit-image="editImage"
                @data-change="dataChange"
                :data-images="images"
            ></vue-upload-multiple-image>
        </div>
        <div class="currenct-image">
            <div class="img" v-for="img in currentImg" :key="img.id">
                <img  :src="img.url.url" alt="">
                <span class="button-x" @click="clickX(img.id)">
                    x
                </span>
            </div>
            
        </div>
    </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import VueUploadMultipleImage from 'vue-upload-multiple-image'
import firebase from 'firebase';
import AreYouSure from "../components/global/AreYouSure.vue"
export default {
    components: {
        VueUploadMultipleImage,
        AreYouSure
    },
    data() {
        return {
            showDelModal : false,
            categoryList: [],
            images: [],
            imageFormData: [],
            imgUrlArr: [],
            imgUrlToPost: [],
            currentImg: [],
            isDelete: false,
            deleteList: [],
            productIdToPost: 0,
            formbuilder: {
            heading: "Thông tin sản phẩm",
            columns: [
                {
                    label: "Tên sản phẩm",
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
                    label: "Phận loại",
                    multiselecttype: true,
                    field: "category",
                    placeholder: "",
                    options: [],
                    labelBy: 'name'
                },
                {
                    label: "Giá",
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
                    label: "Khối lượng",
                    field: "weight",
                    value: "",
                    filterable: true,
                    inputemail: true,
                    placeholder: "",
                    validate: {
                        required,
                    }
                },
                {
                    label: "Số lượng kho",
                    field: "quantity",
                    value: "",
                    filterable: true,
                    inputtype: true,
                    placeholder: ""
                },
                {
                    label: "Mô tả sản phẩm",
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
    async mounted() {
        this.formbuilder.columns[1].options = this.categoryList
        console.log("params", this.$route.params);
        if(this.$route.params.id) {
            this.formbuilder.columns.push(
                {
                label: "Status",
                field: "status",
                value: "",
                readonly: "true",
                filterable: true,
                inputtype: true,
                placeholder: "Status of user"
                }
            )

            for (var item in this.formbuilder.columns) {
                var field = this.formbuilder.columns[item].field;
                this.formbuilder.columns[item].value = this.$route.params[field];
                if(field == 'status') {
                    if(this.$route.params[field] == true) {
                    this.formbuilder.columns[item].value = 'Active'
                    } else this.formbuilder.columns[item].value = 'Locked'
                }
            }

            await this.$api.products.getProductImage(this.$route.params.id)
            .then (res => {
                // res.data.data.forEach((i) => {
                //     this.currentImg.push(i.url.url)
                // })
                this.currentImg = res.data.data
            })

        }
        
    },
    methods: {
        async save(params) {
            console.log(params);
            var pId = 0
            this.productToPost = {
                name : params.name,
                categoryId: params.category.id,
                price: params.price,
                quantity: params.quantity,
                description: params.description,
                weight: params.weight,
                status: true
            }
            if(this.$route.params.id) {
                this.productIdToPost = this.$route.params.id
                var ok = false
                await this.$api.products.updateProduct(this.$route.params.id, this.productToPost)
                .then(res => {
                    console.log(res);
                    ok = (res.status == 200) ? true : false
                })

                if(this.isDelete == true) {
                    this.deleteList.forEach(async (item) => {
                        await this.$api.products.deleteProductImage(item)
                        .then(res => {
                            console.log(res);
                            ok = (res.status == 200) ? true : false
                        })
                    })
                }

                this.imgUrlArr.forEach((item) => {
                    this.create(item)
                })
                this.imgUrlToPost.forEach(async(item) => {
                    await this.$api.products.postImageUrl({url : item})
                    .then(async res => {
                        var payload ={
                            productId: this.productIdToPost,
                            imageId: res.data.id
                        }
                        await this.$api.products.postProductImage(payload)
                        .then(res => {
                            console.log("res up  product img", res);
                            ok = (res.status == 200) ? true : false
                        })
                    })
                })

                if (ok) {
                this.$toasted.success("Product updated");
                this.formbuilder.disabledSave = false;
                this.$router.push({  path: "/shop/products" });
                } else {
                this.$toasted.error("Fail");
                this.formbuilder.disabledSave = false;
                }

            } else {
                await this.$api.products.createProduct(this.productToPost)
                .then(res => {
                    ok = (res.status == 200) ? true : false
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
                            ok = (res.status == 200) ? true : false
                            console.log("res up  product img", res);
                        })
                    })
                })

                if (ok) {
                this.$toasted.success("Product created");
                this.formbuilder.disabledSave = false;
                this.$router.push({  path: "/shop/products" });
                } else {
                this.$toasted.error("Fail");
                this.formbuilder.disabledSave = false;
                }
            }
            
        },
        deleteProduct() {
           this.$api.products.deleteProduct(this.$route.params.id) 
           this.showDelModal = false    
           this.$toasted.success("Product Deleted");
            this.$router.push({ path: "/shop/products" });
        },
        clickX(id) {
            console.log(id);
            var pos
            this.currentImg.forEach((val, idx) => {
                if(val.id == id ) {
                    pos = idx
                    this.deleteList.push(val.id)
                }
            })
            console.log(pos);
            this.currentImg.splice(pos, 1)
            console.log(this.currentImg);
            this.isDelete = true
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
img {
    width: 200px;
}
.img {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}
.button-x {
    position: absolute;
    border: 1px solid red;
    border-radius: 50%;
    background-color: red;
    color: white;
    width: 20px;
    height: 20px;
    right: -7px;
    top: -7px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>