<template>
    <div class="order-detail container">
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
            total: 0
        }
    },
    methods: {
        toProductDetail(id) {
            this.$router.push({name: "ProductDetail", params: { id: id}})
        }
    },
    async beforeMount() {
        this.data = this.$route.params
        const res = await this.$api.orders.getOrderdetailsByOrder(this.data.id)
        res.data.data.forEach((item) => {
            this.products.push(item)
            this.total += item.productAmount * Number(item.productPrice)
        })
        this.fetched = true
        console.log("f",this.products);
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