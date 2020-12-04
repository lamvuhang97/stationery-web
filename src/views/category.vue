<template>
    <div>
        <div class="top-selling home-section">
            <product-section :name="String(categoryId)"></product-section>
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
            categoryId: ''
        }
    },
    methods: {
    },
    watch: {
       '$route.params.categoryName': function () {
            this.categoryId = this.$route.params.categoryName
        }
    },
    async mounted(){
        this.categoryId = this.$route.params.categoryName
    }
}
</script>
<style scoped>
    .home-section {
        margin-top: 40px;
    }
</style>