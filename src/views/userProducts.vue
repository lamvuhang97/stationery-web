<template>
    <div class="user-products">
        <div class="product-item container">
            <div class="row">
                <div class="col-12 col-sm-8 col-md-6 col-lg-4" v-for="item in productData" :key="item">
                    <product-card :product-data="item"></product-card>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ProductCard from "../components/ProductCard"
export default {
    components: {
        ProductCard
    },
    data() {
        return {
            productData: [],
            id: ''
        }
    },
    watch: {
        '$route': function() {
            this.fetchData()
            console.log("change");
        }
    },
    methods: {
        async fetchData() {
            if(this.$route.name === "UserProducts") {
                const res = await this.$api.products.getProductsByOwner(this.id)
                console.log(res);
                this.productData = res.data.data.rows
            }
            if(this.$route.name === "TopSelling") {
                const res = await this.$api.products.getTopSellingByUser(this.id)
                var tmp = []
                res.data.data.forEach((item) => {
                    tmp.push(item.productId)
                })
                var ids = tmp.join()
                
                const response = await this.$api.products.getProductsByGroupId(ids)
                this.productData = response.data.data
            }
        }
    },
    mounted() {
        this.id = this.$route.params.id
        this.fetchData()
        
    }
    
}
</script>
<style scoped>

</style>