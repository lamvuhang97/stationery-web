<template>
    <div class="order-detail container">
        <review-modal v-if="showReviewModal" @no="showReviewModal=false" @yes="yes"></review-modal>
        <add-address class="alert" v-if="showAddModal" @no="showAddModal=false" @yes="addAddress"></add-address>
        <choose-address class="alert" v-if="showChooseModal" @no="showChooseModal=false" @yes="chooseAddress"></choose-address>
        <alert class="alert" v-if="showAlert" @yes="showAlert=false" :text="text"></alert>
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
            <order-item style="margin-bottom:20px"
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
            <span>Tổng tiền: {{total}} $</span>
        </div>
        <div class="order-infor">
            <div class="left">
                <h4>Thông tin đơn hàng</h4>
                <span>Tên người mua:{{data.user.username}}</span>
                <span>Địa chỉ: {{data.address}}</span>
                <span>Số điện thoại: {{data.phonenumber}}</span>
                <span>Mã đơn hàng: {{data.id}}</span>
                <span>Hình thức thanh toán: {{data.payment.name}}</span>
                <span>Tiền vận chuyển: {{data.ship}} $</span>
                <span>Thời gian đặt: {{data.createdAt}}</span>
            </div>
            <div class="right" v-if="data.status.name != 'waiting' && isMyOrder">
                <h4>Thông tin lấy hàng</h4><div v-if="lengthAddress != 0">
                    <span>Tên người bán:{{data.owner.username}}</span>
                    <span>Địa chỉ: {{data.ownerAdd}}</span>
                    <span>Số điện thoại: {{data.ownerPhone}}</span>
                </div>
            </div>
            <div class="right" v-if="data.status.name == 'waiting' && isMyOrder">
                <h4>Thông tin lấy hàng</h4>
                <button class="btn btn-primary" @click="showAddModal = true">Thêm địa chỉ</button>
                <button class="btn btn=primary" @click="showChooseModal = true">Chọn địa chỉ</button>
                <span v-if="lengthAddress == 0">Bạn chưa có địa chỉ lấy hàng nào gần đây. Vui lòng thêm địa chỉ lấy hàng.</span>
                <div v-if="lengthAddress != 0">
                    <span>Tên người bán:</span>
                    <span>Địa chỉ: {{currentAddress.detail}}, {{currentAddress.district.name}}, {{currentAddress.province.name}}</span>
                    <span>Số điện thoại: {{currentAddress.phonenumber}}</span>
                </div>
            </div>
        </div>
        <div class="actions" v-if="data.status.name == 'waiting' && isMyOrder">
            <button class="btn btn-primary" @click="accept" style="margin-right:10px">Xác nhận đơn hàng</button>
            <button class="btn btn-danger" @click="reject">Từ chối đơn hàng</button>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import OrderItem from '../components/OrderItem.vue';
import ReviewModal from '../components/global/ReviewModal.vue';
import AddAddress from "../components/global/AddAddress"
import ChooseAddress from "../components/global/ChooseAddress"
import Alert from '../components/global/Alert.vue';
export default {
    components: {
        OrderItem,
        ReviewModal,
        AddAddress,
        ChooseAddress,
        Alert
    },
    data() {
        return {
            showAlert: false, 
            text: "",
            data: null,
            products: [],
            fetched: false,
            total: 0,
            isMyOrder: false,
            showReviewModal: false,
            currentProductReviewed: 0,
            currentOrderDetailReviewed: 0,
            address: [],
            currentAddress: {},
            showAddModal: false,
            showChooseModal: false
        }
    },
    computed: {
        lengthAddress() {
            return this.address.length
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
            if(this.currentAddress == null) {
                this.showAlert = true;
                this.text = "Vui lòng nhập địa chỉ để nhân viên đến lấy hàng"
            }
            var address = this.currentAddress.detail + ',' +this.currentAddress.district.name + ',' + this.currentAddress.province.name
            var payload = {
                statusId: 2,
                ownerAdd: address,
                ownerPhone: this.currentAddress.phonenumber
            }
            
            await this.$api.orders.updateOrder(this.data.id ,payload)
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
        async addAddress(param) {
            console.log("params", param);
            var payload = {
                userId: Number(this.data.ownerId),
                phonenumber: param.phonenumber,
                provinceId: Number(param.province),
                districtId: Number(param.district),
                detail: param.detail,
                isDefault: false
            }
            await this.$api.address.postAddress(payload).then(res=> {
                console.log(res);
            })

            await this.$api.address.getMyAddress().then(res => {
                console.log("res", res);
                this.address = res.data.data
                if( this.address.length > 0) {
                    this.currentAddress = this.address[0]
                } else {
                    this.currentAddress = null 
                }
                
            })
            this.showAddModal = false
        },
        async chooseAddress(param) {
            await this.$api.address.getAddress(param).then(res => {
                console.log(res);
                this.currentAddress = res.data.data[0]
                console.log(this.currentAddress);
            })
            
            this.showChooseModal = false
        }
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

        await this.$api.address.getMyAddress().then(res => {
            console.log("res", res);
            this.address = res.data.data
            if( this.address.length > 0) {
                this.currentAddress = this.address[0]
            } else {
                this.currentAddress = null 
            }
            
        })
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
.left, .right , .right div{
    display: flex;
    flex-direction: column;
    width: 50%;
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
    }
</style>