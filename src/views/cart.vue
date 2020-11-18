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
    computed: {
        listCart(){
            return this.$store.getters.listCart
        } 
    },
    async beforeMount() {
        await this.$store.dispatch('fetchCart')
    },
    async mounted() {
        console.log("1", this.listCart);
        // const res = await this.$api.carts.getMyCart();
        this.cartByOwner = this.listCart.reduce(function(acc, obj) {
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