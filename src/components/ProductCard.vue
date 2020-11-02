<template>
    <div class="card">
        <img class="card-img" :src="productData.imgUrl" alt="">
        <div class="card-img-overlay d-flex justify-content-end">
            <!-- <i class="fas fa-heart"></i> -->
        </div>
        <div class="card-body">
            <h4 class="card-title">{{productData.name}}</h4>
            <div class="buy d-flex justify-content-between align-items-center">
                <div class="price text-success"><h5 class="mt-4">${{productData.price}}</h5></div>
                <!-- <button @click="addToCart">afa</button> -->
                <button class="btn btn-danger mt-3" @click="addToCart"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
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
    methods: {
        addToCart() {  //not done yet
            console.log('1');
            // this.$emit('add-to-cart')
        }
    }
}
</script>
<style scoped>
</style>