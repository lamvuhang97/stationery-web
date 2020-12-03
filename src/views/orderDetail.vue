<template>
    <div class="order-detail container">
        <review-modal v-if="showReviewModal" @no="showReviewModal=false" @yes="yes"></review-modal>
        <h2 v-if="isMyOrder">Đơn bán</h2>
        <h2 v-if="!isMyOrder">Đơn mua</h2>
        <div class="header">
            <router-link :to="{name: 'User', params: {id : data.ownerId}}" class="nav-link owner">
                <i class="fas fa-store"></i>
                <span>{{data.owner.username}}</span>
            </router-link>
            <span class="status">{{ data.status.name}}</span>
        </div>
        <div class="section-item" v-if="fetched">
            <order-item 
                v-for="(item, ind) in products"
                :key="ind"
                :data="item"
                :status="data.status.name"
                @to-product-detail="toProductDetail"
                @review="review"
            ></order-item>
        </div>
        <hr>
        <div class="sum">
            <span>{{products.length}} sản phẩm</span>
            <span>Tổng tiền: {{total}}</span>
        </div>
        <div class="order-infor">
            <h4>Thông tin đơn hàng</h4>
            <span>Địa chỉ: {{data.address}}</span>
            <span>Số điện thoại: {{data.phonenumber}}</span>
            <span>Mã đơn hàng: {{data.id}}</span>
            <span>Hình thức thanh toán: {{data.payment.name}}</span>
            <span>Thời gian đặt: {{data.createdAt}}</span>
        </div>
        <div class="actions" v-if="data.status.name == 'waiting' && isMyOrder">
            <button class="btn btn-primary" @click="accept">Xác nhận đơn hàng</button>
            <button class="btn btn-danger" @click="reject">Từ chối đơn hàng</button>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import OrderItem from '../components/OrderItem.vue';
import ReviewModal from '../components/global/ReviewModal.vue';
export default {
    components: {
        OrderItem,
        ReviewModal
    },
    data() {
        return {
            data: null,
            products: [],
            fetched: false,
            total: 0,
            isMyOrder: false,
            showReviewModal: false,
            currentProductReviewed: 0,
            currentOrderDetailReviewed: 0
        }
    },
    methods: {
        review(param) {
            this.showReviewModal = true
            this.currentProductReviewed = param.productId
            this.currentOrderDetailReviewed = param.orderdetailId
        },
        yes(param) {
            console.log(param);
            var reviewToPost = {
                userId: Vue.prototype.$localstorage.getUserID(),
                productId: this.currentProductReviewed,
                rate: param.point,
                content: param.content
            }
            this.$api.reviews.postReview(reviewToPost)
            .then(res => {
                console.log(res);
                this.showReviewModal = false
                this.$api.orders.updateIsReview(this.currentOrderDetailReviewed, true)
            })
        },
        toProductDetail(id) {
            this.$router.push({name: "ProductDetail", params: { id: id}})
        },
        async accept() {
            await this.$api.orders.updateOrderStatus({orderId: this.data.id,statusId: 2})
            .then(res => {
                console.log("after update", res);
                this.$toasted.success("Đã xác nhận đơn hàng")
                this.$router.push({path: "/shop/orders/transaction/2"})
            })
        },
        async reject() {
            await this.$api.orders.updateOrderStatus({orderId: this.data.id, statusId: 3})
            .then(res => {
                console.log("after update", res);
                this.$toasted.success("Đã từ chối đơn hàng")
                this.$router.push({path: "/shop/orders/transaction/3"})
            })
        },
    },
    async beforeMount() {
        console.log(this.$route.params);
        this.data = this.$route.params.data
        const res = await this.$api.orders.getOrderdetailsByOrder(this.data.id)
        res.data.data.forEach((item) => {
            this.products.push(item)
            this.total += item.productAmount * Number(item.productPrice)
        })
        this.fetched = true
        if(this.$route.params.type == "my-order") {
            this.isMyOrder = true
        }
        console.log(this.isMyOrder);
    }
}
</script>
<style scoped>
.order-detail{
    padding: 100px 80px 0px 80px;
}
.header {
    justify-content: space-between;
}
    .order-detail .header{
        display: flex;
        align-items: center;
    }
    .owner {
        padding-left: 15px;
        display: flex;
    }
    .owner span {
        padding-left: 5px;
    }
    .sum {

    display: flex;
    justify-content: space-between;
    padding: 0px 100px;

    }
    .order-infor {
            padding-top: 20px;
    display: flex;
    flex-direction: column;
    }
</style>