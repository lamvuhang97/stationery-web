<template>
    <div>
        <div class="top-selling home-section">
            <product-section :name="'TopSelling'"></product-section>
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
        }
    },
    methods: {
    },
    async mounted(){
    }
}
</script>
<style scoped>
    .home-section {
        margin-top: 40px;
    }
</style>