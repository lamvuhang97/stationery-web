<template>
    <div class="order-detail container" :key="componentKey">
        <review-modal v-if="showReviewModal" @no="showReviewModal=false" @yes="yes"></review-modal>
        <add-address class="alert" v-if="showAddModal" @no="showAddModal=false" @yes="addAddress"></add-address>
        <choose-address class="alert" v-if="showChooseModal" @no="showChooseModal=false" @yes="chooseAddress"></choose-address>
        <alert class="alert" v-if="showAlert" @yes="showAlert=false" :text="text"></alert>
        <h2 v-if="isMyOrder">Đơn bán</h2>
        <h2 v-if="!isMyOrder">Đơn mua</h2>
        <hr style="border: 2px solid #9b83d6;">
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
                :statusId="data.statusId"
                @to-product-detail="toProductDetail"
                @review="review"
            ></order-item>
        </div>
        <hr>
        <div class="sum">
            <span>{{products.length}} sản phẩm</span>
            <span>Tiền hàng: {{total}} $</span>
        </div>
        <div class="sum">
            <span>   </span>
            <span>Vận chuyển: {{data.ship}} $</span>
        </div>
        <div class="sum">
            <span>  </span>
            <span>Tổng thanh toán: <span style="color: red">{{Number(total) + Number(data.ship)}} $</span></span>
        </div>
        <div class="order-infor">
            <div class="left">
                <h4>Thông tin đơn hàng</h4>
                <div class="left-infor">
                    <span>Mã đơn hàng: {{data.id}}</span>
                    <span>Hình thức thanh toán: {{data.payment.name}}</span>
                    <span>Thời gian đặt: {{Date(data.createdAt).toString().substring(0,25)}}</span>
                    <span>Tên người mua:{{data.user.username}}</span>
                    <span>Địa chỉ nhận hàng: {{data.address}}</span>
                    <span>Số điện thoại: {{data.phonenumber}}</span>
                </div>
            </div>
            <div class="right" v-if="data.statusId != 1">
                <h4>Thông tin lấy hàng</h4><div v-if="lengthAddress != 0">
                    <div class="right-infor">
                        <span>Tên người bán:{{data.owner.username}}</span>
                        <span>Địa chỉ: {{data.ownerAdd}}</span>
                        <span>Số điện thoại: {{data.ownerPhone}}</span>
                    </div>
                </div>
            </div>
            <div class="right" v-if="data.statusId == 1 && isMyOrder">
                <h4>Thông tin lấy hàng</h4>
                <button class="btn btn-primary" @click="showAddModal = true">Thêm địa chỉ</button>
                <button class="btn btn=primary" @click="showChooseModal = true">Chọn địa chỉ</button>
                <span v-if="lengthAddress == 0">Bạn chưa có địa chỉ lấy hàng nào gần đây. Vui lòng thêm địa chỉ lấy hàng.</span>
                <div class="right-infor" v-if="lengthAddress != 0">
                    <span>Tên người bán:</span>
                    <span>Địa chỉ: {{currentAddress.detail}}, {{currentAddress.district.name}}, {{currentAddress.province.name}}</span>
                    <span>Số điện thoại: {{currentAddress.phonenumber}}</span>
                </div>
            </div>
        </div>
        <div class="actions" v-if="data.statusId == 4 && !isMyOrder && validTime">
            <button class="btn btn-danger" @click="showReasonModal=true">Trả hàng</button>
            <button class="btn btn-danger" @click="confirmDone">Da nhan hang</button>
        </div>
        <add-reason class="alert" v-if="showReasonModal" @no="showReasonModal=false" @yes="sendReason"></add-reason>
        <div class="actions" v-if="data.status.id == 1 && !isMyOrder">
            <button class="btn btn-danger" @click="reject">Hủy đơn hàng</button>
        </div>
        <div class="actions" v-if="data.status.id == 1 && isMyOrder">
            <button class="btn btn-primary" @click="accept" style="margin-right:10px">Xác nhận đơn hàng</button>
            <button class="btn btn-danger" @click="reject">Từ chối đơn hàng</button>
        </div>
        <div class="ship" style="margin-top:10px">
            <h4>Thông tin vận chuyển </h4>
            <div v-for="(item, i) in dataHistory" :key="i" style="margin: 10px 0px; display:flex" class="his-item">
                <span>{{new Date(item.createdAt).toString().substring(0, 25)}}</span>
                <div style="display:flex; flex-direction:column;">
                    <i class="fas fa-dot-circle" style="margin:0px 20px"></i>
                    <div style="border-right:2px solid; height: 25px; width: 25%; margin: 10px 0px 0px 15px">  </div>
                </div>
                <div style="display:flex; flex-direction: column">
                    <span>{{item.status.name}}</span>
                    <span style="display:block;">{{item.detail}}</span>
                </div>
            </div>
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
import AddReason from "../components/global/AddReason.vue";
export default {
    components: {
        OrderItem,
        ReviewModal,
        AddAddress,
        ChooseAddress,
        Alert,
        AddReason
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
            showChooseModal: false,
            showReasonModal: false,
            componentKey: 0,
            dataHistory: [],
        }
    },
    computed: {
        lengthAddress() {
            return this.address.length
        },
        validTime() {
            var now = new Date()
            var date = new Date(this.data.updatedAt)
            console.log(now, date, now -  date);
            var time = Number(now - date) / 3600000
            if(time > 72) {
                return false
            } else {
                return true
            }
        }
    },
    methods: {
        review(param) {
            this.showReviewModal = true
            this.currentProductReviewed = param.productId
            this.currentOrderDetailReviewed = param.orderdetailId
        },
        async yes(param) {
            console.log(param);
            var reviewToPost = {
                userId: Vue.prototype.$localstorage.getUserID(),
                productId: this.currentProductReviewed,
                rate: param.point,
                content: param.content
            }
            await this.$api.reviews.postReview(reviewToPost)
            .then(res => {
                console.log(res);
                this.showReviewModal = false
                this.$api.orders.updateIsReview(this.currentOrderDetailReviewed, true)
            })
            this.componentKey += 1
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
            .then(async res => {
                console.log("after update", res);
                this.$toasted.success("Đã xác nhận đơn hàng")
                this.$router.push({path: "/shop/orders/transaction/2"})
                await this.$api.history.createHistory({
                    orderId: this.data.id,
                    statusId: 2
                }).then(rr => {console.log(rr);})
            })
        },
        async reject() {
            var detail
            if(this.isMyOrder) {
                detail= "Nguoi ban tu choi don hang"
            } else {
                detail = "Nguoi mua huy don hang"
            }
            await this.$api.orders.updateOrderStatus({orderId: this.data.id, statusId: 5})
            .then(async res => {
                console.log("after update", res);
                this.$toasted.success("Đã từ chối đơn hàng")
                this.$router.push({path: "/shop/orders/transaction/5"})
                await this.$api.history.createHistory({
                    orderId: this.data.id,
                    statusId: 5,
                    detail: detail
                }).then(rr => {console.log(rr);})
            })
            // hoan tien cho nguoi mua neu don hang thanh toan paypal
            if(this.data.paymentId == 3){
                var total = Number(this.data.total) + Number(this.data.ship)
                var wallet = 0
                await this.$api.users.get(this.data.userId)
                .then(async res => {
                    if(res.data.data.wallet == null) {
                        wallet = 0
                    } else  {wallet = Number(res.data.data.wallet)}
                    await this.$api.authentications.updateWallet(this.data.userId, {wallet: wallet + total})
                })

                var tranToPost = {
                    userId: this.data.userId,
                    orderId: this.data.id,
                    amount: total,
                    type: "Hoan Tien",
                    status: "Success"
                }
                await this.$api.transactions.postTransaction(tranToPost)
                .then(r => {
                    console.log(r);
                })
            }

            // thay doi so luong san pham
            this.products.forEach(async p => {
                await this.$api.products.updateProduct(p.productId, {quantity: p.product.quantity + p.productAmount, sold: p.product.sold - p.productAmount})
            })

        },
        async sendReason(param) {
            await this.$api.orders.updateOrderStatus({orderId: this.data.id, statusId: 6})
            .then(async res => {
                console.log("after update", res);
                this.$toasted.success("Đã gởi yêu cầu trả hàng")
                this.$router.push({path: "/shop/orders/transaction/7"})
                await this.$api.history.createHistory({
                    orderId: this.data.id,
                    statusId: 6,
                    detail: param
                }).then(rr => {console.log(rr);})
            })
            this.showReasonModal = false
            this.data.statusId = 6
            this.data.status.name ="Chờ xử lý"
        },
        async confirmDone() {
            await this.$api.orders.updateOrderStatus({orderId: this.data.id, statusId: 9})
            .then(async res => {
                console.log("after update", res);
                this.$toasted.success("Đã xác nhận nhan hang")
                // this.$router.push({path: "/shop/orders/transaction/2"})
                await this.$api.history.createHistory({
                    orderId: this.data.id,
                    statusId: 9
                }).then(rr => {console.log(rr);})
            })

            //tra tien cho nguoi ban neu nguoi mua xac nhan don hang thanh cong
            var total = Number(this.data.total)
            var wallet = 0
            await this.$api.users.get(this.data.ownerId)
            .then(async res => {
                if(res.data.data.wallet == null) {
                    wallet = 0
                } else  {wallet = Number(res.data.data.wallet)}
                await this.$api.authentications.updateWallet(this.data.ownerId, {wallet: wallet + total})
            })

            var tranToPost = {
                userId: this.data.ownerId,
                orderId: this.data.id,
                amount: Number(this.data.total),
                type: "Cong Tien",
                status: "Success"
            }
            await this.$api.transactions.postTransaction(tranToPost)
            .then(r => {
                console.log(r);
            })

            this.data.statusId = 9
            this.data.status.name ="Hoàn thành"
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
        },

        async fetchHistory() {
            await this.$api.history.getHistoryByOrder(this.data.id)
            .then(res => {
                console.log("history",res);
                this.dataHistory = res.data.data
                console.log(this.dataHistory);
            })
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
        console.log("products", this.products);
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
        await this.$api.history.getHistoryByOrder(this.data.id)
            .then(res => {
                console.log("history",res);
                this.dataHistory = res.data.data
                console.log(this.dataHistory);
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
    width: auto;
}
.left-infor, .right-infor{
        display: flex;
        flex-direction: column;
        border: 1px solid;
        border-radius: 10px;
        padding: 10px;
        background-color: #bdace4ab;
        margin: 10px;
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
    .his-item:last-child div{
        display: none;
    }
</style>