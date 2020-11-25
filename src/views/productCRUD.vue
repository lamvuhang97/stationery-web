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
export default {
    components: {
        VueUploadMultipleImage,
    },
    data() {
        return {
            categoryList: [],
            images: [],
            imageFormData: [],
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
            console.log(params);
            this.productToPost = {
                name : params.name,
                // ownerId: myId,
                categoryId: params.category.id,
                price: params.price,
                quantity: params.quantity,
                description: params.description,
                status: true
            }
            await this.$api.products.createProduct(this.productToPost)
            .then(res => {
                console.log(res);
            })
            console.log("rrrrrrrr", this.imageFormData);
        },
        uploadImageSuccess(formData, index, fileList) {
            console.log('data', formData, index, fileList)
            this.imageFormData = fileList
            // Upload image api
            // axios.post('http://your-url-upload', { data: formData }).then(response => {
            //   console.log(response)
            // })
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