<template>
    <div class="cart-item"  v-if="hasProps">
        <div class="select">
            <input type="checkbox" 
            :value="data.product.name"
            :checked="isCheckAll"
            @click="clickItem"
            >
        </div>
        <div class="image" @click="toProductDetail">
            <img :src="imageUrl" alt="">
        </div>
        <div class="infor">
            <div class="product-infor" @click="toProductDetail">
                <span class="name">
                    {{data.product.name}}
                </span>
                <span class="price">{{data.product.price}} VND</span>
            </div>
            <div class="quantity">
                <label for="quantity" style="margin-right:10px">Số lượng: </label>
                <input 
                    type="number" id="quantity" 
                    v-model="data.productAmount" 
                    name="quantity" min="1" 
                    :max="data.product.quantity"
                    @change="updateAmount"
                >
            </div>
            
            <div>
                <span>Kho: {{data.product.quantity}}</span>
            </div>
            <div class="total-price">
                <span>{{ totalPrice}} VND</span>
            </div>
        </div>
        <div class="delete">
            <button class="btn btn-danger" @click="deleteCart">Xóa</button>
        </div>
        <alert class="alert" v-if="showModal" @yes="returnAmount" :text="text"></alert>
        
    </div>
</template>
<script>
import Alert from "../components/global/Alert"
export default {
    components: {
        Alert
    },
    data() {
        return {
            selectedProducts: [],
            showModal: false,
            text: '',
            hasProps: false
        }
    },
    props: {
        data: {
            type: Object,
            default: null
        },
        isCheckAll: {
            type: Boolean,
            default: false
        }
    },
    watch: {
    },
    computed: {
        totalPrice() {
            return (this.data.product.price * this.data.productAmount)
        },
        imageUrl() {
            if(this.data.product.images.length > 0 ) {
                return this.data.product.images[0].url.url
            } else return "/assets/img/default_images/product.png"
        },
        productAmount() {
            return this.data.productAmount
        }
    },
    methods: {
        returnAmount() {
            this.data.productAmount = this.data.product.quantity
            this.showModal = false
        },
        clickItem(e) {
            this.$emit("click-item", e.target)
        },
        async updateAmount() {
            console.log("cahnge",this.data.productAmount, this.data.product.quantity);
            if(Number(this.data.productAmount) > Number(this.data.product.quantity) ||
                Number(this.data.productAmount == 0)){
                this.showModal = true
                this.text ="Bạn không thể mua quá số lượng sản phẩm hiện có"
                return
            }
            await this.$store.dispatch('updateProductAmount',{id : this.data.id, data: {productAmount: this.data.productAmount}})
        },
        deleteCart() {
            this.$emit('delete-cart', this.data.id)
        },
        toProductDetail() {
            this.$router.push({name: "ProductDetail", params: { id: this.data.productId}})
        },
    },
    beforeMount() {
        console.log(this.data);
        if( this.data.productAmount >= this.data.product.quantity) {
            this.data.productAmount = this.data.product.quantity
            this.hasProps = true
        }
        this.hasProps = true
    }
}
</script>
<style scoped>
    .cart-item {
        display: flex;
        align-items: center;
        padding: 0px 50px;  
    }
    .image img {
        width: 150px;
    }
    .infor {
        display:flex;
        flex-grow: 1;
        justify-content: space-around;
        justify-content: space-between;
    }
    .product-infor {
        display: flex;
        flex-direction: column;
    }
</style>