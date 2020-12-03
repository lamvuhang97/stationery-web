<template>
    <div>
        <div class="top-selling home-section">
            <product-section :name="'TopSelling'" @add-to-cart="addToCart"></product-section>
        </div>
        <div class="new-arrival home-section">
            <product-section :name="'NewArrival'" @add-to-cart="addToCart"></product-section>
        </div>
        <div class="categorysum home-section" v-for="item in categorysumName" :key="item">
            <product-section :name="item" @add-to-cart="addToCart"></product-section>
        </div>
        <button @click="toPaypal">Paypal</button>
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
        toPaypal() {
            this.$router.push({name: "Paypal"})
        }
    },
    async mounted(){
        const categoryRes = await this.$api.category.getAllCategorysum()
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