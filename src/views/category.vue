<template>
    <div>
        <div class="top-selling home-section">
            <product-section :name="categoryName" @add-to-cart="addToCart"></product-section>
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
            categoryName: ''
        }
    },
    methods: {
        addToCart() {
            console.log("add to cart")
        },
    },
    watch: {
       '$route.params.categoryName': function () {
            this.categoryName = this.$route.params.categoryName
        }
    },
    async mounted(){
        this.categoryName = this.$route.params.categoryName
    }
}
</script>
<style scoped>
    .home-section {
        margin-top: 40px;
    }
</style>