<template>
    <div class="cart container">
        <are-you-sure v-if="showModal" @no="showModal=false" @yes="deleteCart"></are-you-sure>
        <cart-section 
            v-for="(item, ind) in cartByOwner" 
            :key="ind" 
            :list-cart="item" 
            :owner="ind"
            @delete-cart="confirmDelete"
        ></cart-section>
    </div>
</template>
<script>
import CartSection from "../components/CartSection.vue"
import AreYouSure from "../components/global/AreYouSure.vue"
export default {
    components: {
        CartSection, 
        AreYouSure
    },
    data() {
        return {
            cartByOwner:[],
            showModal: false,
            currentId: ''
        }
    },
    computed: {
        listCart(){
            return this.$store.getters.listCart
        } 

    },
    watch: {
        "listCart"() {
            this.cartByOwner = this.listCart.reduce(function(acc, obj) {
                var key = obj.product.owner.username
                if(!acc[key]) {
                    acc[key] = []
                }
                acc[key].push(obj)
                return acc
            }, {});
        }
    },
    methods: {
        confirmDelete(id) {
            this.showModal = true
            this.currentId = id 
        },
        async deleteCart() {
            await this.$store.dispatch('deleteCart',this.currentId);
            this.showModal = false
        }
    },
    async beforeMount() {
        await this.$store.dispatch('fetchCart')
    },
    async mounted() {
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