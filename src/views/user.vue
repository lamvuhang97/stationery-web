<template>
  <div >
    <div class="information">
        <div class="avatar">
          <div class="img" style="border-radius: 50%">
            <img class="preview" height="268" width="356" :src="imgUrl">
          </div>
        </div>
        <div class="profile">
          <custom-form :formbuilder="formbuilder" ></custom-form>
        </div>
    </div>
    <div class="user-products" style="display:flex">
        <div class="filter-section" style="margin-left:20px">
          <filter-product @filter="filter"></filter-product>
        </div>
        <div class="product-item container">
            <div class="row">
                <div class="col-12 col-sm-8 col-md-6 col-lg-4" v-for="item in productData" :key="item" style="margin-bottom:20px">
                    <product-card :product-data="item"></product-card>
                </div>
            </div>
        </div>
    </div>
    <div class="pagination">
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
    <!-- <div class="sidebar">
      <ul>
        <li class="navitem" role="presentation">
          <router-link :to="'/user/' + id + '/products'" class="navlink">
            <span>Sản Phẩm</span>
          </router-link>
        </li>
        <li class="navitem" role="presentation">
          <router-link :to="'/user/' + id + '/top-selling'" class="navlink">
            <span>Bán chạy</span>
          </router-link>
        </li>
        <li class="navitem" role="presentation">
          <router-link :to="'/user/' + id + '/new-arrival'" class="navlink">
            <span>Mới nhất</span>
          </router-link>
        </li>
      </ul>
    </div>
    <router-view></router-view> -->
  </div>
</template>

<script>
import ProductCard from "../components/ProductCard"
import FilterProduct from "../components/Filter";
import Paginate from 'vuejs-paginate'
export default {
  name: "User",
  components: {
        ProductCard,
        FilterProduct,
        Paginate
    },
  data() {
    return {
      offset: 0,
      filterString: '',
      productData: [],
      id: '',
      userData: {},
      imgUrl: "/assets/img/logo.jpg",
      formbuilder: {
        heading: "Thông tin người dùng",
        columns: [
          {
            label: "Tên đăng nhập",
            field: "username",
            value: "",
            filterable: true,
            inputtype: true,
            placeholder: "Username of user"
          },
          {
            label: "Email",
            field: "email",
            value: "",
            filterable: true,
            inputemail: true,
            placeholder: "Email of user"
          },
          {
            label: "Trạng thái",
            field: "status",
            value: "",
            readonly: "true",
            filterable: true,
            inputtype: true,
            placeholder: "Status of user"
            }
        ],
        disabledSave: false,
        hiddenSave : true,
        isLoading: false,
        buttonsavelabel: "Save",
        reloadFormbuilder: true
      },
    }
  },
  computed: {
    pageCount() {
            console.log(this.countProduct);
            return parseInt(this.countProduct / this.limit) + 1
        },
  },
  watch: {
    "filterString"() {
        this.fetchData()
    }
  },
  async beforeMount() {
    
  },
  methods: {
    filter(param) {
        this.filterString = param
    },
    functionName(pageNum) {
        console.log(pageNum);
        this.offset = (pageNum-1)*this.limit
        this.fetchData()
    },
    async fetchData() {
      const res = await this.$api.products.getProductsByOwner(this.id, this.offset, 15,this.filterString)
      console.log(res);
      this.productData = res.data.data.rows
    },
    test() {
      this.$router.push({name:"UserProducts"})
    }
  },
  async mounted() {
    this.id = this.$route.params.id
    const res = await this.$api.users.get(this.id)
    this.userData = res.data.data
    if(this.userData.avatar != ''){
      this.imgUrl = this.userData.avatar
    }

    if (this.userData) {
      for (var item in this.formbuilder.columns) {
        var field = this.formbuilder.columns[item].field;
        this.formbuilder.columns[item].value = this.userData[field];
        if(field == 'status') {
          if(this.userData[field] == true) {
            this.formbuilder.columns[item].value = 'Hoạt động'
          } else this.formbuilder.columns[item].value = 'Khóa'
        }
      }
    }

    this.fetchData()
  }
}
</script>
<style scoped>
  img {
    border-radius: 50%;
    width: 200px;
    height: 200px;
    margin-bottom: 20px;
  }
  .information {
    padding-top: 100px;
    display: flex;
    justify-content: space-around;
    margin-left: 40px;
    align-items: center;
  }
  .avatar {
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .profile {
    width: 70%;
  }
  .sidebar ul{
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px;
  }
  .sidebar ul li {
    padding: 0 20px;
    color: black;
  }
  a {
    color: black;
    text-decoration: none;
  }
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
</style>
