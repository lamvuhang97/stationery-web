<template>
    <div class="order-detail container">
        <h2 v-if="isMyOrder">Don ban</h2>
        <h2 v-if="!isMyOrder">Don mua</h2>
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
                @to-product-detail="toProductDetail"
            ></order-item>
        </div>
        <hr>
        <div class="sum">
            <span>{{products.length}} san pham</span>
            <span>Tong tien: {{total}}</span>
        </div>
        <div class="order-infor">
            <h4>Thong tin don hang</h4>
            <span>Dia chi: {{data.address}}</span>
            <span>So dien thoai: {{data.phonenumber}}</span>
            <span>Ma don hang: {{data.id}}</span>
            <span>Hinh thuc thanh toan: {{data.payment.name}}</span>
            <span>Thoi gian dat: {{data.createdAt}}</span>
        </div>
        <div class="actions" v-if="data.status.name == 'waiting' && isMyOrder">
            <button class="btn btn-primary" @click="accept">Xac nhan don hang</button>
            <button class="btn btn-danger" @click="reject">Tu choi don hang</button>
        </div>
    </div>
</template>
<script>
import OrderItem from '../components/OrderItem.vue';
export default {
    components: {
        OrderItem
    },
    data() {
        return {
            data: null,
            products: [],
            fetched: false,
            total: 0,
            isMyOrder: false
        }
    },
    methods: {
        toProductDetail(id) {
            this.$router.push({name: "ProductDetail", params: { id: id}})
        },
        async accept() {
            await this.$api.orders.updateOrderStatus({orderId: this.data.id,statusId: 2})
            .then(res => {
                console.log("after update", res);
            })
        },
        async reject() {
            await this.$api.orders.updateOrderStatus({orderId: this.data.id, statusId: 3})
            .then(res => {
                console.log("after update", res);
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