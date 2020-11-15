<template>
    <div class="cart-item">
        <div class="select">
            <input type="checkbox">
        </div>
        <div class="image">
            <img :src="imageUrl" alt="">
        </div>
        <div class="infor">
            <div class="product-infor">
                <span class="name">
                    {{data.product.name}}
                </span>
                <span class="price">{{data.product.price}} VND</span>
            </div>
            <div class="quantity">
                <label for="quantity" style="margin-right:10px">Num: </label>
                <input type="number" v-model="data.productAmount" id="quantity" name="quantity" min="1" :max="data.product.quantity">
            </div>
            <div class="total-price">
                <span>{{ totalPrice}} VND</span>
            </div>
        </div>
        <div class="delete">
            <button class="btn btn-danger">Delete</button>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        data: {
            type: Object,
            default: null
        }
    },
    computed: {
        totalPrice() {
            return (this.data.product.price * this.data.productAmount)
        },
        imageUrl() {
            if(this.data.product.images.length > 0 ) {
                return this.data.product.images[0].url.url
            } else return "/assets/img/default_images/product.png"
        }
    },
    methods: {
    },
    mounted() {
    }
}
</script>
<style scoped>
    .cart-item {
        display: flex;
        align-items: center;
        padding: 0px 50px;  
    }
    .image img {
        width: 150px;
    }
    .infor {
        display:flex;
        flex-grow: 1;
        justify-content: space-around;
    }
    .product-infor {
        display: flex;
        flex-direction: column;
    }
</style>