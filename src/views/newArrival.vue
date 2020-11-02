<template>
<div class="container">
  <div class="row">
    <div class="col-12 col-sm-8 col-md-6 col-lg-4">
        <product-card :product-data="productData" @add-to-cart="addToCart"></product-card>
    </div>
  </div>
</div>
</template>
<script>
import ProductCard from "../components/ProductCard.vue"
export default {
    components: {
        ProductCard
    },
    data() {
        return {
            productData: {
                imgUrl: '/assets/img/1.jpeg',
                name: 'Example',
                price: '432'
            }
        }
    },
    methods: {
        addToCart() {
            console.log("add to cart")
        },
    }
}
</script>