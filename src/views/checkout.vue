<template>
    <div class="checkout container">
        <add-address class="alert" v-if="showAddModal" @no="showAddModal=false" @yes="addAddress"></add-address>
        <choose-address class="alert" v-if="showChooseModal" @no="showChooseModal=false" @yes="chooseAddress"></choose-address>
        <paypal v-if="showPaypal" @close="showPaypal=false" @complete="complete" :amount="Number(dataParams.price) + Number(ship)"></paypal>
        <alert class="alert" v-if="showAlert" @yes="showAlert=false" :text="text"></alert>
        <h2>Xác nhận đặt hàng</h2>
        <div class="infor">
            <div class="infor-checkout">
                <div class="top">
                    <h3>Thông tin nhận hàng</h3>
                    <button class="btn btn-primary" @click="showAddModal = true" style="margin-right:10px">Thêm địa chỉ</button>
                    <button class="btn btn-primary" @click="showChooseModal = true">Chọn địa chỉ</button>
                </div>
                <span v-if="lengthAddress == 0">Bạn chưa có địa chỉ nhận hàng nào gần đây. Vui lòng thêm địa chỉ nhận hàng.</span>
                <div class="infor-user" v-if="lengthAddress != 0">
                    <div class="name">Người nhận: {{dataUser.username}}</div>
                    <div class="phonenumber">Số điện thoại: {{currentAddress.phonenumber}}</div>
                    <div class="address">Địa chỉ nhận hàng: {{currentAddress.detail}}, {{currentAddress.district.name}}, {{currentAddress.province.name}}</div>
                </div>
            </div>
             <div class="infor-payment">
                <h3>Thông tin thanh toán</h3>
                <div class="payment">
                    <div>Phương thức thanh toán</div>
                    <input type="radio" id="cod" value="1" name="payment" @change="selectPayment" checked>
                    <label for="cod">Thanh toán khi nhận hàng</label>
                    <input type="radio" id="paypal" value="3" name="payment" @change="selectPayment">
                    <label for="cod">Thanh toán trực tuyến</label>
                </div>
                <div class="payment">
                    Tiền hàng: {{dataParams.price}}
                </div>
                <div class="ship">
                    Tiền vận chuyển: {{ship}}
                </div>
                <div class="total-payment">
                    Tổng tiền: {{dataParams.price + ship}}
                </div>
                <button class="btn btn-primary" @click="confirm"> Đặt hàng</button>
            </div>
        </div>
        
        <div class="products">
            <h3>Sản phẩm</h3>
            <div class="owner"> Người bán: {{dataParams.owner}}</div>
            <div class="product-item" v-for="item in dataParams.items" :key="item">
                <div class="image">
                    <img 
                    :src="item.product.images.length > 0 ? item.product.images[0].url.url : '/assets/img/default_images/product.png'" alt="">
                </div>
                <div class="infor">
                    <div class="product-infor">
                        <span class="name">
                            {{item.product.name}}
                        </span>
                        <span class="price">{{item.product.price}} VND</span>
                    </div>
                    <div class="quantity">
                        <label for="quantity" style="margin-right:10px">Số lượng: {{item.productAmount}} </label>
                    </div>
                    <div class="total-price">
                        <span>{{item.productAmount * item.product.price}} VND</span>
                    </div>
                </div>
            </div>
        </div>
       
    </div>
</template>
<script>
import AddAddress from "../components/global/AddAddress"
import ChooseAddress from "../components/global/ChooseAddress"
import Paypal from "../components/Paypal"
import Alert from '../components/global/Alert.vue';
export default {
    components: {
        AddAddress,
        ChooseAddress,
        Paypal, 
        Alert
    },
    data() {
        return {
            showAlert : false,
            text : "",
            dataParams: {},
            dataUser: {},
            note: '',
            selectedPayment: '1',
            orderToPost: {},
            orderdetailToPost: {},
            address: [],
            currentAddress: {},
            showAddModal: false,
            showChooseModal: false,
            showPaypal : false
        }
    },
    computed: {
        imageUrl() {
            if(this.d.product.images.length > 0 ) {
                return this.data.product.images[0].url.url
            } else return "/assets/img/default_images/product.png"
        },
        ship() {
            var weight = 0
            this.dataParams.items.forEach(item => {
                weight += Number(item.product.weight)* Number(item.productAmount)
            })
            console.log("weight", weight);
            if(weight <= 1000 ) {
                return 20
            } else if(weight > 2000) {
                return 30
            } else {
                return 25
            }
        },
        lengthAddress() {
            return this.address.length
        }
    },
    methods: {
        close() {
            this.showPaypal = false
        },
        async complete() {
            this.showPaypal = false
            console.log("complete");
            await this.$api.orders.createOrder(this.orderToPost)
            .then(res => {
                console.log(res);
                this.dataParams.items.forEach(async(item) => {
                    var cartId = item.id
                    this.orderdetailToPost = {
                        orderId: res.data.id,
                        productId: item.productId,
                        productAmount: item.productAmount,
                        productPrice: item.product.price,
                        isReview: false
                    }
                    console.log(this.orderdetailToPost);
                    await this.$api.orders.createOrderdetail(this.orderdetailToPost)
                    .then(async response => {
                        console.log(response);
                        console.log("dataParams", this.dataParams);
                        this.dataParams.items.forEach(async p => {
                            await this.$api.products.updateProduct(p.productId, {quantity: p.product.quantity - p.productAmount, sold: p.product.sold + p.productAmount})
                        })
                        this.$toasted.success("Dat hang thanh cong");
                        this.$router.push({path: "/account/transaction/0"})
                        await this.$store.dispatch('deleteCart',cartId)
                    })
                })
            })
        },
        async confirm() {
            if(this.currentAddress == null) {
                this.showAlert = true;
                this.text = "Vui lòng nhập địa chỉ để nhân viên giao hàng"
            }
            console.log(this.dataUser);
            console.log(this.selectedPayment);
            var address = this.currentAddress.detail + ',' +this.currentAddress.district.name + ',' + this.currentAddress.province.name
            this.orderToPost = {
                userId: Number(this.dataUser.id),
                ownerId: Number(this.dataParams.items[0].product.ownerId),
                phonenumber: this.currentAddress.phonenumber,
                address: address,
                statusId: 1,
                paymentId: Number(this.selectedPayment),
                orderNote: this.note,
                total: this.dataParams.price,
                ship: this.ship
            }
            console.log(this.orderToPost);
            if( this.selectedPayment == 1) {
                await this.$api.orders.createOrder(this.orderToPost)
                .then(res => {
                    console.log(res);
                    this.dataParams.items.forEach(async(item) => {
                        var cartId = item.id
                        this.orderdetailToPost = {
                            orderId: res.data.id,
                            productId: item.productId,
                            productAmount: item.productAmount,
                            productPrice: item.product.price,
                            isReview: false
                        }
                        console.log(this.orderdetailToPost);
                        await this.$api.orders.createOrderdetail(this.orderdetailToPost)
                        .then(async response => {
                            console.log(response);
                            console.log("dataParams", this.dataParams);
                            this.dataParams.items.forEach(async p => {
                                await this.$api.products.updateProduct(p.productId, {quantity: p.product.quantity - p.productAmount, sold: p.product.sold + p.productAmount})
                            })
                            this.$toasted.success("Dat hang thanh cong");
                            this.$router.push({path: "/account/transaction/0"})
                            await this.$store.dispatch('deleteCart',cartId)
                        })
                    })
                })
            } else if ( this.selectedPayment == 3) {
                this.showPaypal = true
            }
            
        },
        selectPayment(e) {
            this.selectedPayment = e.target.value
        },
        async addAddress(param) {
            console.log("params", param);
            var payload = {
                userId: Number(this.dataUser.id),
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
    async mounted() {
        this.dataParams  = this.$route.params
        console.log("dataparam",this.$route.params);
        var response = await this.$api.authentications.getProfile();
        this.dataUser = response.data;
        console.log(this.dataUser);

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
.infor-content {
    display: flex;

}
.infor-checkout {
    width: 50%
}
.infor-payment {
    padding-left: 20px;
    width: 50%;
}
.infor-user {
        display: flex;
    flex-direction: column;
}
.infor-user div {
        display: flex;
    justify-content: space-between;
    padding-bottom: 5px;
}
.infor-user div input {
        width: 60%;
}
    .product-item {
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
    }
    .product-infor {
        display: flex;
        flex-direction: column;
    }
</style>