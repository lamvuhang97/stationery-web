<template>
    <div>
        <div class="top-selling home-section">
            <product-section :name="'Top Selling'" @add-to-cart="addToCart"></product-section>
        </div>
        <div class="new-arrival home-section">
            <product-section :name="'New Arrival'" @add-to-cart="addToCart"></product-section>
        </div>
        <div class="categorysum home-section" v-for="item in categorysumName" :key="item">
            <product-section :name="item" @add-to-cart="addToCart"></product-section>
        </div>
    </div>
</template>
<script>
import ProductSection from "../components/ProductSection.vue"
export default {
    components: {
        ProductSection
    },
    data() {
        return {
            categorysumName: []
        }
    },
    methods: {
        addToCart() {
            console.log("add to cart")
        },
    },
    async mounted(){
        const categoryRes = await this.$api.category.getAllCategory()
        categoryRes.data.data.forEach((item) => {
            this.categorysumName.push(item.name)
        })
    }
}
</script>
<style scoped>
    .home-section {
        margin-top: 40px;
    }
</style>