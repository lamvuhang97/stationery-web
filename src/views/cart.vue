<template>
    <div class="cart container">
        <cart-section v-for="(item, ind) in cartByOwner" :key="ind" :list-cart="item" :owner="ind"></cart-section>
    </div>
</template>
<script>
import CartSection from "../components/CartSection.vue"
export default {
    components: {
        CartSection
    },
    data() {
        return {
            cartByOwner:[]
        }
    },
    async mounted() {
        const res = await this.$api.carts.getMyCart();
        this.cartByOwner = res.data.data.reduce(function(acc, obj) {
            var key = obj.product.owner.username
            if(!acc[key]) {
                acc[key] = []
            }
            acc[key].push(obj)
            return acc
        }, {});

    }
    
}
</script>
<style scoped>
    .cart {

    }
</style>