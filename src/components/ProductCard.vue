<template>
    <div class="product-card" @click="detail">
        <alert class="alert" v-if="showModal" @yes="showModal=false" :text="'Ban khong the mua san pham cua chinh minh'"></alert>
        <div class="product-image">
            <img :src="imgUrl" alt="">
            <!-- <div class="card-img-overlay d-flex justify-content-end">
                <i class="fas fa-heart"></i>
            </div> -->
        </div>
        <div class="product-info">
            <h4 class="name">{{productData.name}}</h4>
            <div class="buy">
                <div class="price">
                    <h5>${{productData.price}}</h5>
                </div>
                <div class="cart">
                    <button class="btn btn-danger mt-3" @click="addToCart"><i class="fas fa-shopping-cart"></i>Thêm vào giỏ hàng</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Alert from "../components/global/Alert"
export default {
    components: {
        Alert
    },
    data() {
        return {
            showModal: false,
            productToPost: {
                productId: Number(this.productData.id),
                productAmount: 1
            }
        }
    },
    props: {
        productData: {
            type: Object,
            default: null
        }
    },
    computed: {
        imgUrl() {
            if(this.productData.images.length > 0){
                return this.productData.images[0].url.url
            } else {
                return '/assets/img/default_images/product.png'
            }
        }
    },
    methods: {
        async addToCart(e) {
            e.stopPropagation();
            await this.$api.authentications.getProfile()
            .then(async res => {
                if(this.productData.ownerId != res.data.id) {
                    await this.$store.dispatch('addCartItem', this.productToPost)
                } else {
                 this.showModal = true
                }
            })
        },
        detail() {
            this.$router.push({name: "ProductDetail", params: { id: this.productData.id }})
        }
    }
}
</script>
<style scoped>
    .product-card{
        max-width: 300px;
    }
    .product-image img{
        width: 100%;
        height: 250px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        object-fit: cover;
    }
    .buy {
        display: flex;
        justify-content: space-between;
        padding: 0 15px;
        align-items: center;
    }
    .product-info {
        background-color: #e6e0e6;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    .name {
        margin: 0 15px;
        padding-top: 10px;  
    }
    .cart {
        margin-bottom: 15px;
    }
</style>