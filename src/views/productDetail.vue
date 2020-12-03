<template>
    <div class="product-detail container">
        <alert class="alert" v-if="showModal" @yes="showModal=false" :text="'Ban khong the mua san pham cua chinh minh'"></alert>
        <div class="general">
            <carousel :perPage="1" :autoplayHoverPause="true" :paginationEnabled="false" class="images">
                <slide v-for="item in productImages" :key="item">
                    <img :src="item" alt="...">
                </slide>
            </carousel>
            <div class="infor">
                <h2>{{ productData.name }}</h2>
                <div class="rate-sold">
                    <div class="rate">Đánh giá: 4.5 stars </div>
                    <div class="sold" style="margin-left:20px"> Đã bán: {{productData.sold}} sản phẩm </div>
                </div>
                <div class="price"> Giá: <span style="color:red">{{ productData.price }} VND</span></div>
                <div class="category"> Phân loại: {{ productData.category }} </div>
                <div class="weight">Khối lượng: {{productData.weight}}</div>
                <div class="number">
                    <label for="quantity" style="margin-right:10px">Số lượng: </label>
                    <input type="number" id="quantity" name="quantity" min="1" :max="productData.quantity" v-model="num">
                    <span style="margin-left:20px">Kho: {{ productData.quantity }}</span>
                </div>
                <div class="action">
                    <button class="btn btn-danger" @click="addToCart"><i class="fas fa-shopping-cart" ></i>Thêm vào giỏ hàng</button>
                    <button class="btn btn-danger" >Mua ngay</button>
                </div>
            </div>
        </div>
        <router-link :to="{name: 'User', params: {id : ownerData.id}}" class="nav-link owner">
            <div class="owner-infor">
                <img :src="ownerImg" alt="">
                <span>{{ownerData.username}}</span>
            </div>
        </router-link>
        <div class="description">
            <h4>Mô tả</h4>
            <span>{{ productData.description }}</span>
        </div>
        <div class="review">
            <h4>Bình luận, đánh giá</h4>
            <div v-for="item in reviewData" :key="item">
                <review-item :data="item"></review-item>
            </div>
        </div>
    </div>
</template>
<script>
import { Carousel, Slide } from 'vue-carousel';
import Alert from "../components/global/Alert.vue"
import ReviewItem from "../components/ReviewItem.vue"
import Vue from 'vue';
export default {
    name: "ProductDetail",
    components: {
        Carousel,
        Slide,
        Alert,
        ReviewItem
    },
    data() {
        return {
            showModal: false,
            id: '',
            productData: {},
            ownerData: {},
            productImages: ["/assets/img/default_images/product.png"],
            num:1,
            productToPost: {},
            reviewData: []
        }
    },
    computed: {
        ownerImg() {
            if(this.ownerData.avatar != "") {
                return this.ownerData.avatar
            } else {
                return "/assets/img/logo.jpg"
            }
        }
    },
    methods: {
        async addToCart() {
            this.productToPost = {
                productId: this.id,
                productAmount: this.num
            }
            if(this.productData.owner != Vue.prototype.$localstorage.getName()) {
                await this.$store.dispatch('addCartItem', this.productToPost)
            } else {
                this.showModal = true
            }
        },
    },
    async mounted() {
        this.id = this.$route.params.id
        const res = await this.$api.products.get(this.id)
        this.productData = res.data.data
        if(this.productData.images.length > 0) {
            this.productImages =[]
            this.productData.images.forEach((item) => {
                this.productImages.push(item.url.url)
            })
        }
        console.log(this.productImages);
        const response = await this.$api.users.get(this.productData.ownerId)
        this.ownerData = response.data.data

        const r = await this.$api.reviews.getReviewByProduct(this.id)
        this.reviewData = r.data.data.rows
    }
}
</script>
<style scoped>
    .alert {
        z-index: 1000;
    }
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
    .owner-infor img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 15px;
    }
    .owner-infor {
        display: flex;
        align-items: center;
    }
</style>