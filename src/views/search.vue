<template>
  <div class="product-section">
    <div class="filter-section">
      <filter-product @filter="filter"></filter-product>
    </div>
    <div style="width: 100%">
      <div class="section-title">
        <hr class="hr" />
        <span>Search Result User</span>
        <hr class="hr" />
      </div>
      <div class="user-item container">
        <div class="row">
          <div
            class="col-12 col-sm-8 col-md-6 col-lg-4"
            v-for="item in userData"
            :key="item"
          >
            <router-link
              :to="{ name: 'User', params: { id: item.id } }"
              class="nav-link owner"
            >
              <div class="user-infor">
                <img v-if="item.avatar != ''" :src="item.avatar" />
                <img
                  v-if="item.avatar == ''"
                  src="/assets/img/logo.jpg"
                  alt=""
                />
                <span>{{ item.username }}</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="section-title">
        <hr class="hr" />
        <span>Search Result Product</span>
        <hr class="hr" />
      </div>
      <div class="product-item container">
        <div class="row">
          <div
            class="col-12 col-sm-8 col-md-6 col-lg-4"
            v-for="item in productData"
            :key="item"
          >
            <product-card
              :product-data="item"
              @add-to-cart="addToCart"
            ></product-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ProductCard from "../components/ProductCard";
import FilterProduct from "../components/Filter";
export default {
  components: {
    ProductCard,
    FilterProduct
  },
  data() {
    return {
      searchkey: "",
      productData: [],
      userData: [],
      filterString: ''
    };
  },
  watch: {
    $route() {
      this.searchkey = this.$route.query.searchkey;
      this.fetchData();
    },
    "filterString"() {
        this.fetchData()
    }
  },
  computed: {
    userImg() {
      if (this.userData.avatar != "") {
        return this.userData.avatar;
      } else {
        return "/assets/img/logo.jpg";
      }
    },
  },
  methods: {
    filter(param) {
        this.filterString = param
    },
    async fetchData() {
      await this.$api.products.searchProduct(this.searchkey, this.filterString).then((res) => {
        console.log(res);
        this.productData = res.data.data.rows;
      });
      await this.$api.users.searchUser(this.searchkey).then((res) => {
        this.userData = res.data.data.rows;
      });
    },
  },
  async mounted() {
    this.searchkey = this.$route.query.searchkey;
    this.fetchData();
  },
};
</script>
<style scoped>
.product-section {
    display: flex;
}
.filter-section {
  margin-left: 20px;
}
.search {
  padding-top: 100px;
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
.col-12 {
  margin-bottom: 20px;
}
.user-infor img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}
.user-infor {
  display: flex;
  align-items: center;
}
</style>
