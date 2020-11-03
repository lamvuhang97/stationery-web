<template>
    <div class="search-bar">
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
        addToCart() {
            this.$emit('add-to-cart')
        }
    }
}
</script>
<style scoped>
</style>