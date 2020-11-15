<template>
    <div class="product-detail container">
        <div class="general">
            <carousel :perPage="1" :autoplayHoverPause="true" :paginationEnabled="false" class="images">
                <slide v-for="item in productImages" :key="item">
                    <img :src="item" alt="...">
                </slide>
            </carousel>
            <div class="infor">
                <h2>{{ productData.name }}</h2>
                <div class="rate-sold">
                    <div class="rate">Rate: 4.5 stars </div>
                    <div class="sold" style="margin-left:20px"> Sold: 234 items </div>
                </div>
                <div class="price"> Price: <span style="color:red">{{ productData.price }} VND</span></div>
                <div class="category"> Category: {{ productData.category }} </div>
                <div class="number">
                    <label for="quantity" style="margin-right:10px">Num: </label>
                    <input type="number" id="quantity" name="quantity" min="1" :max="productData.quantity" v-model="num">
                    <span style="margin-left:20px">Quantity: {{ productData.quantity }}</span>
                </div>
                <div class="action">
                    <button class="btn btn-danger" @click="addToCart"><i class="fas fa-shopping-cart" ></i> Add to Cart</button>
                    <button class="btn btn-danger" @click="test">Buy now</button>
                </div>
            </div>
        </div>
        <div class="owner">

        </div>
        <div class="description">
            <h4>Description</h4>
            <span>{{ productData.description }}</span>
        </div>
        <div class="review">
            <h4>Review</h4>
        </div>
    </div>
</template>
<script>
import { Carousel, Slide } from 'vue-carousel';
export default {
    name: "ProductDetail",
    components: {
        Carousel,
        Slide
    },
    data() {
        return {
            id: '',
            productData: {},
            productImages: ["/assets/img/default_images/product.png"],
            num:1,
            productToPost: {}
        }
    },
    methods: {
        test() {
            console.log("test");
        },
        async addToCart() {
            this.productToPost = {
                productId: this.id,
                productAmount: this.num
            }
            const res = await this.$api.carts.createCart(this.productToPost)
            console.log(res);
        },
    },
    async mounted() {
        this.id = this.$route.params.id
        const res = await this.$api.products.get(this.id)
        console.log(res);
        this.productData = res.data.data
        if(this.productData.images.length > 0) {
            this.productImages =[]
            this.productData.images.forEach((item) => {
                this.productImages.push(item.url.url)
            })
        }
        
    }
}
</script>
<style scoped>
    img {
        width: 100%;
        height: 300px;
        object-fit: cover;
    }
    .product-detail{
        padding: 0px 50px;
    }
    .infor div{
        margin-top: 10px;
    }
    .general {
        display: flex;
        align-items: center;
    }
    .product-detail .images {
        width: 50%;
        padding: 10px;
    }
    .product-detail .infor {
        margin-left: 30px;
        width: 50%;
    }
    .rate-sold{
        display: flex;
    }
    .price {
        font-size: 20px;
    }
    .action button {
        margin-right: 20px;
    }
</style>