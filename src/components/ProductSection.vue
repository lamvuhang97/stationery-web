<template>
    <div class="pdroduct-section">
        <div class="section-title">
            <hr class="hr"> <span>{{name}}</span> <hr class="hr">
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
        }
    }, 
    data() {
        return {
            productData: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart')
        },
        async fetchData() {
            this.productData = []
            if(this.name == "NewArrival") {
                const res = await this.$api.products.getNewArrival()
                console.log("kuckkkkk",res);
                this.productData = res.data.data
                return
            }
            
            const res = await this.$api.category.getAllProductByCategorysum(this.name)
            res.data.data.categorysub.forEach((item) => {
                item.products.forEach((i) => {
                    this.productData.push(i)
                })
            })
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

</style>