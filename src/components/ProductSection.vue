<template>
    <div class="pdroduct-section">
        <div class="section-title">
            <hr class="hr"> <span>{{sectionHeader}}</span> <hr class="hr">
            <!-- <div class="filter" v-if="$route.name != 'Home'">
                <label for="filter">Loc theo:  </label> 
                <select id="filter">
                    <option value="up">Gia cao dan</option>
                    <option value="down">Gia thap dan</option>
                    <option value="1">0 - 100.000VND</option>
                    <option value="2">100.000VND - 200.000VND</option>
                    <option value="3">200.000VND - 300.000VND</option>
                    <option value="4"> > 300.000VND</option>
                </select>
            </div> -->
        </div>
        
        <div class="product-item container">
            <div class="row">
                <div class="col-12 col-sm-8 col-md-6 col-lg-4" v-for="item in productData" :key="item">
                    <product-card :product-data="item" @add-to-cart="addToCart"></product-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProductCard from "./ProductCard"
export default {
    components: {
        ProductCard
    },
    props: {
        name: {
            type: String,
            default: ''
        },
        limit: {
            type: Number,
            default: 0,
            required: false
        },
        offset: {
            type: Number,
            default: 0,
            required: false
        }
    }, 
    data() {
        return {
            productData: [], 
            sectionHeader: ''
        }
    },
    methods: {
        async fetchData() {
            var limit = 3
            this.productData = []
            if(this.name == "TopSelling") {
                this.sectionHeader = 'Bán chạy'
                const res = await this.$api.products.getTopSelling(limit)
                var tmp = []
                res.data.data.forEach((item) => {
                    tmp.push(item.productId)
                })
                var ids = tmp.join()
                
                const response = await this.$api.products.getProductsByGroupId(ids)
                this.productData = response.data.data
                return
            }

            if(this.name == "NewArrival") {
                this.sectionHeader = 'Mới nhất'
                const res = await this.$api.products.getNewArrival(limit)
                this.productData = res.data.data
                return
            }

            if(this.name == "user") {
                const res = await this.$api.products.getNewArrival()
                this.productData = res.data.data
                return
            }
            
            this.sectionHeader = this.name
            if(this.$route.name == "Home"){
                const res = await this.$api.category.getAllProductByCategorysum(this.name)
                res.data.data.categorysub.forEach((item) => {
                    item.products.forEach((i) => {
                        this.productData.push(i)
                    })
                })
                return
            } else {
                console.log("2", this.name);
                const res = await this.$api.category.getProductByCategory(this.name)
                res.data.data.products.forEach((item) => {
                        this.productData.push(item)
                })
                return
            }
            
        }
    },
    watch: {
        name() {
            this.fetchData()
        }
    },
    async mounted() { 
        this.fetchData()
        console.log(this.productData);
    }
}
</script>

<style scoped>
    .section-title {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }
    .section-title span {
        font-size: 26px;
    }
    .hr {
        margin: auto 5px;
        width: 100px;
        border: 3px solid #dacfd9;
    }
    .filter {
        position: absolute;
        right: 145px;
    }
    .filter select{
        padding: 2px 10px;
        border-radius: 5px;
        margin-left: 10px;
    }
</style>