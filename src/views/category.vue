<template>
    <div>
        <div class="top-selling home-section">
            <product-section :name="String(categoryId)" :value="value" ></product-section>
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
            categoryId: '',
            value: ''
        }
    },
    methods: {
    },
    watch: {
       '$route.params.categoryName': function () {
            this.categoryId = this.$route.params.categoryName
            this.value = this.$route.params.value
        }
    },
    async mounted(){
        this.categoryId = this.$route.params.categoryName
        this.value = this.$route.params.value
    }
}
</script>
<style scoped>
    .home-section {
        margin-top: 40px;
    }
</style>