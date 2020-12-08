<template>
    <div class="category">
        <div class="filter-section">
            <filter-product @filter="filter"></filter-product>
        </div>
        <div class="top-selling home-section">
            <product-section :name="String(categoryId)" :value="value" :filter="filterString"></product-section>
        </div>
    </div>
</template>
<script>
import ProductSection from "../components/ProductSection.vue"
import FilterProduct from "../components/Filter.vue";
export default {
    components: {
        ProductSection,
        FilterProduct
    },
    data() {
        return {
            categoryId: '',
            value: '',
            filterString : ''
        }
    },
    methods: {
        filter(param) {
            console.log("param", param);
            this.filterString = param
        }
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
.category {
    display: flex;
}
.filter-section {
    margin-left: 20px;
}
    .home-section {
        margin-top: 40px;
        width: 100%;
    }
</style>