<template>
    <div class="checkout container">
        <div class="infor-checkout">
            <h2>Thong tin nhan hang</h2>
            <div class="infor-content">
                <div class="infor-user">
                    <div>
                        <label for="name">Ten nguoi nhan</label>
                        <input type="text" id="name" readonly v-model="dataUser.username">
                    </div>
                    <div>
                        <label for="address">Dia chi nhan hang</label>
                        <input type="text" id="address" v-model="dataUser.address">
                    </div>
                    <div>
                        <label for="phone">So dien thoai</label>
                        <input type="text" id="phone" v-model="dataUser.phonenumber">
                    </div>
                    <div>
                        <label for="note">Ghi chu</label>
                        <input type="text" id="note" v-model="note">
                    </div>
                </div>
                <div class="infor-payment">
                    <div class="payment">
                        <div>Phuong thuc thanh toan</div>
                        <input type="radio" id="cod" value="1" name="payment" @change="selectPayment" checked>
                        <label for="cod">Thanh toan khi nhan hang</label>
                        <input type="radio" id="paypal" value="3" name="payment" @change="selectPayment">
                        <label for="cod">Thanh toan truc tuyen</label>
                    </div>
                    <div class="total-payment">
                        Tong tien: {{dataParams.price}}
                    </div>
                    <button class="btn btn-primary" @click="confirm"> Dat hang</button>
                </div>
            </div>
        </div>
        <div class="products">
            <h2>San pham</h2>
            <div class="owner"> Nguoi ban: {{dataParams.owner}}</div>
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
                orderNote: this.note
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
                        this.$router.push({path: "/account/transaction/0"})
                        await this.$store.dispatch('deleteCart',cartId);
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