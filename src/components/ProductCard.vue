<template>
    <div class="product-card">
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
                    <button class="btn btn-danger mt-3" @click="addToCart"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {

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
        addToCart() {
            this.$emit('add-to-cart')
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