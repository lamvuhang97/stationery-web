<template>
    <div class="order-item" @click="toProductDetail">
        <div class="image" v-if="fetched">
            <img :src="imageUrl" alt="">
        </div>
        <div class="infor">
            <div class="product-infor">
                <span class="name">
                    {{dataProduct.name}}
                </span>
                <span class="category">Phan loai: {{dataProduct.category}}</span>
            </div>
            <div class="price">
                <span>{{data.productPrice }} $</span>
            </div>
            <div class="quantity">
                <span>x {{data.productAmount }}</span>
            </div>
            <div class="product-price">
                <span>{{ productPrice}} $</span>
            </div>
        </div>
        <button class="review" @click="review" v-if="!data.isReview && statusId == 9">Đánh giá</button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            selectedProducts: [],
            dataProduct: null,
            fetched: false,
        }
    },
    props: {
        data: {
            type: Object,
            default: null
        },
        statusId: {
            type: Number
        }
    },
    watch: {
    },
    computed: {
        productPrice() {
            return (this.data.productPrice * this.data.productAmount)
        },
        imageUrl() {
            if(this.dataProduct.images.length > 0 ) {
                return this.dataProduct.images[0].url.url
            } else return "/assets/img/default_images/product.png"
        }
    },
    methods: {
        toProductDetail() {
            this.$emit('to-product-detail', this.dataProduct.id)
        },
        review(e) {
            e.stopPropagation();
            this.$emit('review', {productId: this.dataProduct.id, orderdetailId: this.data.id})
        }
    },
    async beforeMount() {
        console.log("mounted", this.data, this.statusId);
        const res = await this.$api.products.get(this.data.productId)
        console.log("h", res);
        this.dataProduct = res.data.data
        this.fetched = true
    }
}
</script>
<style scoped>
    .order-item {
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
    }
    .product-infor {
        display: flex;
        flex-direction: column;
    }
</style>