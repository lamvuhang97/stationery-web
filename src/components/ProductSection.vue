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
                    <product-card :product-data="item"></product-card>
                </div>
            </div>
        </div>
        <div class="pagination" v-if="showPagination">
            <paginate
                :page-count="pageCount"
                :page-range="3"
                :click-handler="functionName"
                :prev-text="'Prev'"
                :next-text="'Next'"
                :container-class="'paginate'"
                :pageClass="'page-item'">
            </paginate>
        </div>
    </div>
</template>

<script>
import ProductCard from "./ProductCard"
import Paginate from 'vuejs-paginate'
export default {
    components: {
        ProductCard,
        Paginate
    },
    props: {
        name: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            required: false,
            default: ''
        },
        filter: {
            type: String,
            required: false,
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
    computed: {
        pageCount() {
            console.log(this.countProduct);
            return parseInt(this.countProduct / this.limit) + 1
        },
        showPagination() {
            if(this.$route.fullPath.includes("home")) {
                return false
            } else return true
        }
        
                
    },
    data() {
        return {
            productData: [], 
            sectionHeader: '',
            countProduct: 0,
        }
    },
    methods: {
        functionName(pageNum) {
            console.log(pageNum);
            this.offset = (pageNum-1)*this.limit
            this.fetchData()
        },
        async fetchData() {
            this.limit = 15
            this.productData = []
            if(this.name == "TopSelling") {
                this.sectionHeader = 'Bán chạy'
                if(this.$route.fullPath.includes("home")){
                    const res = await this.$api.products.getTopSelling(0,3)
                    this.productData = res.data.data.rows
                    return
                } else {
                    const res = await this.$api.products.getTopSelling(this.offset,this.limit)
                    this.productData = res.data.data.rows
                    this.countProduct = res.data.data.count
                    return
                }
                
            }

            if(this.name == "NewArrival") {
                this.sectionHeader = 'Mới nhất'
                if(this.$route.fullPath.includes("home")){
                    const res = await this.$api.products.getNewArrival(0,3)
                    this.productData = res.data.data.rows
                    return
                } else {
                    const res = await this.$api.products.getNewArrival(this.offset,this.limit)
                    this.productData = res.data.data.rows
                    this.countProduct = res.data.data.count
                    return
                }
            }

            if(this.name == "user") {
                const res = await this.$api.products.getNewArrival(this.offset,this.limit)
                this.productData = res.data.data
                return
            }
            
            this.sectionHeader = this.value
            if(this.$route.name == "Home"){
                const res = await this.$api.products.getProductByCategory(this.name, 0,3, '')
                console.log(this.name, res);
                res.data.data.rows.forEach((item) => {
                        this.productData.push(item)
                })
                return
            } else {
                if(this.name) {
                    console.log("filter", this.filter);
                    const res = await this.$api.products.getProductByCategory(this.name, this.offset, this.limit, this.filter)
                    if(res.status == 200) {
                        res.data.data.rows.forEach((item) => {
                            this.productData.push(item)
                        })
                        this.countProduct = res.data.data.count
                        return 
                    }
                }
                return
            }
            
        }
    },
    watch: {
        name() {
            console.log("change", this.name);
            this.fetchData()
        },
        "filter"() {
            console.log("change");
            this.fetchData()
        }
    },
    async mounted() { 
        console.log("mounted", this.name);
        this.fetchData()
        console.log(this.productData);
    }
}
</script>

<style scoped>
    .paginate {
        list-style: none;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px auto;
    }
    .page-item.active {
        padding: 10px;
        background-color: blueviolet;
    }
    .page-item.disable {
        padding: 10px;
    }
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