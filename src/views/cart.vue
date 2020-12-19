<template>
    <div class="cart container">
        <are-you-sure v-if="showModal" @no="showModal=false" @yes="deleteCart"></are-you-sure>
        <cart-section 
            v-for="(item, ind) in cartByOwner" 
            :key="ind" 
            :list-cart="item" 
            :owner="ind"
            @delete-cart="confirmDelete"
            @selected-cart-item="selectedCartItem"
        ></cart-section>
        <div style="height: 20px"></div>
        <div class="banner" v-if="showBanner">
            <span>Người bán: {{selectedOwner}} </span>
            <span>Số lượng: {{selectedItem.length}}</span>
            <span>Tổng tiền: {{priceInBanner}}</span>
            <button class="btn btn-success" @click="toCheckout">Đặt hàng</button>
        </div>
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
            showBanner: false,
            currentId: '',
            selectedItem: [],
            selectedOwner: ''
        }
    },
    computed: {
        listCart(){
            return this.$store.getters.listCart
        },
        priceInBanner(){
            var price = 0;
            this.selectedItem.forEach((item) => {
                price += Number(item.product.price) * Number(item.productAmount)
            })
            return price
        },
        totalWeight() {
            var totalWeight = 0;
            this.selectedItem.forEach((item) => {
                totalWeight += Number(item.product.weight) * Number(item.productAmount)
            })
            return totalWeight
        }
    },
    watch: {
        "listCart"() {
            this.listCart.forEach(async item => {
                // var quantity = String(item.product.quantity)
                if (item.productAmount > item.product.quantity) {
                    // await this.$store.dispatch('updateProductAmount',{id : item.productId, data: {productAmount: quantity}})
                    item.productAmount = item.product.quantity
                }
            })

            this.cartByOwner = this.listCart.reduce(function(acc, obj) {
                var key = obj.product.owner.username
                if(!acc[key]) {
                    acc[key] = []
                }
                acc[key].push(obj)
                return acc
            }, {});
        },
        "selectedItem"() {
            console.log(this.selectedItem);
            if(this.selectedItem.length == 0) {
                this.showBanner = false
            } else {
                this.showBanner = true
            }
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
        },
        selectedCartItem(param) {
            console.log("par",param);
            this.selectedItem = param[0]
            this.selectedOwner = param[1]
        },
        toCheckout() {
            this.$router.push({name: "Checkout", params: {owner: this.selectedOwner, items: this.selectedItem, price: this.priceInBanner, weight: this.totalWeight}})
        }
    },
    async beforeMount() {
        await this.$store.dispatch('fetchCart')
        // this.listCart.forEach(async item => {
        //     var quantity = String(item.product.quantity)
        //     if (item.productAmount > item.product.quantity) {
        //         await this.$store.dispatch('updateProductAmount',{id : item.productId, data: {productAmount: quantity}})
        //     }
        // })
    },
    async mounted() {
        console.log("list cart", this.listCart);
        // this.listCart.forEach(async item => {
        //     var quantity = String(item.product.quantity)
        //     if (item.productAmount > item.product.quantity) {
        //         await this.$store.dispatch('updateProductAmount',{id : item.productId, data: {productAmount: quantity}})
        //     }
        // })
        this.cartByOwner = this.listCart.reduce(function(acc, obj) {
            var key = obj.product.owner.username
            if(!acc[key]) {
                acc[key] = []
            }
            acc[key].push(obj)
            return acc
        }, {});

        // check if amount > quantity then set quantity = amount ==> not done yet
    }
    
}
</script>
<style scoped>
    .banner {
        padding: 20px;
        border: 1px solid;
        position: fixed;
        bottom: 10px;
        background-color: white;
        width: 78%;
        margin: auto;
        right: 140px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>