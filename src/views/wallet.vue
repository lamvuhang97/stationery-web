<template>
    <div class="wallet container">
        <pay-out v-if="showModal" :max="walletAmount" @no="showModal = false" @yes="payout"></pay-out>
        <div class="wallet-amount">
            <h4>Bạn đang có: {{walletAmount}} $</h4>
            <button class="btn btn-primary" @click="showModal = true">Rút tiền</button>
        </div>
        <h4>Giao dịch: </h4>
        <div class="transaction">
            <custom-table :props="props" :reload="reload"></custom-table>
        </div>
    </div>
</template>
<script>
import PayOut from '../components/global/PayOut.vue'
import Vue from 'vue'
export default {   
    components: {
        PayOut
    },
    data() {
        return {
            showModal: false,
            props: {
                norowsfound: "transaction ",
                searchname: "Search for a product by name...",
                columns: [
                {
                    label: "Mã giao dịch",
                    field: "id",
                    type: 'number',
                    filterable: true
                },
                {
                    label: "Mã đơn hàng",
                    field: "orderId",
                    type: 'number',
                    filterable: true
                },
                {
                    label: "Email giao dịch",
                    field: "email",
                    type: 'string',
                    filterable: true
                },
                {
                    label: "Loại giao dịch",
                    field: "type",
                    type: 'string',
                    filterable: true
                },
                {
                    label: "Số tiền",
                    field: "amount",
                    type: 'string',
                    filterable: true
                },
                {
                    label: "Trạng thái giao dịch",
                    field: "status",
                    type: 'string',
                    filterable: true
                },
                ],
                remoteURL: this.$settings.baseURL + "/transactions/my-transaction",
                isLoading: false,
                reload: false,
                searchParams: "name",
            },
        }
    }, 
    computed: {
        walletAmount(){
            return this.$store.getters.wallet
        },
    },
    methods: {
        async payout(param) {
            console.log(param);
            var tranToPost = {
                userId: Vue.prototype.$localstorage.getUserID(),
                orderId: null,
                email: param.email,
                amount: param.amount,
                type: "Rut Tien",
                status: "Pending"
            }
            await this.$api.transactions.postTransaction(tranToPost)
            .then(async res => {
                console.log(res);
                var newWallet = Number(this.walletAmount) - Number(param.amount)
                console.log(newWallet);
                await this.$store.dispatch('updateWallet', {id: Vue.prototype.$localstorage.getUserID(), data :{wallet: newWallet}})
                this.reload = !this.reload
            })
            this.showModal = false
            // call api payout and waiting for the response 
        },
    },
    async mounted() {
        await this.$store.dispatch('fetchWallet')
    }
    
}
</script>
<style scoped>

</style>