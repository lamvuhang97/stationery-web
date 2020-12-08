<template>
    <div>
        <div class="top-selling home-section">
            <product-section :name="'TopSelling'"></product-section>
        </div>
        <div class="new-arrival home-section">
            <product-section :name="'NewArrival'"></product-section>
        </div>
        <div class="category home-section" v-for="item in categoryName" :key="item">
            <product-section :name="item.id" :value="item.name"></product-section>
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
            categoryName: []
        }
    },
    methods: {
        toPaypal() {
            this.$router.push({name: "Paypal"})
        }
    },
    async mounted(){
        const categoryRes = await this.$api.category.getAllCategory()
        categoryRes.data.data.rows.forEach((item) => {
            this.categoryName.push({name:item.name, id: item.id})
        })
    }
}
</script>
<style scoped>
    .home-section {
        margin-top: 40px;
    }
</style>