<template>
    <div class="checkout container">
        <div class="infor-checkout">
            <h2>Thông tin nhận hàng</h2>
            <div class="infor-content">
                <div class="infor-user">
                    <div>
                        <label for="name">Tên người nhận</label>
                        <input type="text" id="name" readonly v-model="dataUser.username">
                    </div>
                    <div>
                        <label for="address">Địa chỉ nhận hàng</label>
                        <input type="text" id="address" v-model="dataUser.address">
                    </div>
                    <div>
                        <label for="phone">Số điện thoại</label>
                        <input type="text" id="phone" v-model="dataUser.phonenumber">
                    </div>
                    <div>
                        <label for="note">Ghi chú</label>
                        <input type="text" id="note" v-model="note">
                    </div>
                </div>
                <div class="infor-payment">
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
        </div>
        <div class="products">
            <h2>Sản phẩm</h2>
            <div class="owner"> Người bán: {{dataParams.owner}}</div>
                <div class="product-item" v-for="item in dataParams.items" :key="item">
                    <div class="image">
                        <img 
                        :src="item.product.image > 0 ? item.product.image[0].url.url : '/assets/img/default_images/product.png'" alt="">
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
export default {
    data() {
        return {
            dataParams: {},
            dataUser: {},
            note: '',
            selectedPayment: '1',
            orderToPost: {},
            orderdetailToPost: {}
        }
    },
    computed: {
        imageUrl() {
            if(this.d.product.images.length > 0 ) {
                return this.data.product.images[0].url.url
            } else return "/assets/img/default_images/product.png"
        },
        ship() {
            if(this.dataParams.weight <= 1000 ) {
                return 20000
            } else if(this.dataParams.weight > 2000) {
                return 30000
            } else {
                return 25000
            }
        }
    },
    methods: {
        async confirm() {
            console.log(this.dataUser);
            console.log(this.selectedPayment);
            this.orderToPost = {
                userId: Number(this.dataUser.id),
                ownerId: Number(this.dataParams.items[0].product.ownerId),
                phonenumber: this.dataUser.phonenumber,
                address: this.dataUser.address,
                statusId: 1,
                paymentId: Number(this.selectedPayment),
                orderNote: this.note,
                total: this.dataParams.price,
                ship: this.ship
            }
            console.log(this.orderToPost);
            await this.$api.orders.createOrder(this.orderToPost)
            .then(res => {
                console.log(res);
                this.dataParams.items.forEach(async(item) => {
                    var cartId = item.id
                    this.orderdetailToPost = {
                        orderId: res.data.id,
                        productId: item.productId,
                        productAmount: item.productAmount,
                        productPrice: item.product.price
                    }
                    console.log(this.orderdetailToPost);
                    await this.$api.orders.createOrderdetail(this.orderdetailToPost)
                    .then(async response => {
                        console.log(response);
                        console.log("dataParams", this.dataParams);
                        this.dataParams.items.forEach(async p => {
                            await this.$api.products.updateProduct(p.productId, {quantity: p.product.quantity - p.productAmount, sold: p.product.sold + p.productAmount})
                        })
                        this.$router.push({path: "/account/transaction/0"})
                        await this.$store.dispatch('deleteCart',cartId)
                    })
                })
            })
            
            
        },
        selectPayment(e) {
            this.selectedPayment = e.target.value
        }
    },
    async mounted() {
        this.dataParams  = this.$route.params
        console.log(this.$route.params);
        var response = await this.$api.authentications.getProfile();
        this.dataUser = response.data;
        console.log(this.dataUser);
    }
}
</script>
<style scoped>
.infor-content {
    display: flex;

}
.infor-payment {
    padding-left: 20px;
}
.infor-user {
        display: flex;
    flex-direction: column;
    width: 50%;
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
        justify-content: space-around;
    }
    .product-infor {
        display: flex;
        flex-direction: column;
    }
</style>