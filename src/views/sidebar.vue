<template>
  <div class="header">
    <div class="carousel">
      <div id="carouselExampleInterval" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active" data-interval="10000">
            <img src="/assets/img/a.jpg" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item" data-interval="2000">
            <img src="/assets/img/b.jpg" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="/assets/img/c.jpg" class="d-block w-100" alt="...">
          </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleInterval" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleInterval" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>
    </div>
    <div class="sidebar">
      <ul>
        <li class="navitem" role="presentation">
          <span class="navLink" @click="showCategory = !showCategory">Phân loại</span>
          <div class="allCategory" v-if="showCategory">
            <div v-for="(value, key) in allCategory" :key="key" class="cate">
                <div v-for="item in value" :key="item" class="subCate">
                  <router-link :to="{ name: 'Category', params: { categoryName: item.id }}" class="navlink">
                    <span>{{item.name}}</span>
                  </router-link>
                </div>
            </div>
          </div>
          <!-- <router-link to="/" class="navlink">
            <span>All Category</span>
          </router-link> -->
        </li>
        <li class="navitem" role="presentation">
          <router-link to="/home" class="navlink">
            <span>Trang chủ</span>
          </router-link>
        </li>
        <li class="navitem" role="presentation">
          <router-link to="/topselling" class="navlink">
            <span>Bán chạy</span>
          </router-link>
        </li>
        <li class="navitem" role="presentation">
          <router-link to="/newarrival" class="navlink">
            <span>Mới nhất</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import store from "@/services/storage/store";
export default {
  data() {
    return {
      role: "",
      showCategory: false,
      allCategory: {}
      // category: {
      //   book : ['book', 'notebook', 'buller journal'],
      //   paper: ['sticker', 'sticky note', 'paper'],
      //   bag: ['tote bag', 'back bag', 'pen case'],
      //   accessories: ['pen', 'tape', 'accessories'],
      //   other: ['other']
      // }
    };
  },
  watch: {
      '$route': function () {
          this.showCategory = false
      }
  },
  async mounted() {
    const categoryRes = await this.$api.category.getAllCategorysum()
    categoryRes.data.data.forEach((item) => {
      let arr =[]
      item.categorysub.forEach((i) => {
        arr.push({name:i.name, id: i.id})
      })
      this.allCategory[item.name] = arr
    })
    console.log("allcategory",this.allCategory);
  }
}
</script>
<style scoped>
  .header {
    padding-top: 100px;
  }
  .text-light ul{
    width: 100% !important;
    display: flex;
    justify-content: center;
    align-items: center;
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
  .carousel-item img {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }
  .navitem:visited {
    background-color: #dacfd9;
  }
  .allCategory {
    display: flex;
    position: absolute;
    z-index: 1;
    right: 0;
    background-color: white;
    width: 100%;
    margin-top: 20px;
    padding: 0 75px;
    justify-content: space-between;
    border-top: 1px solid;
  }
  .allCategory .cate {
    padding: 10px;
    width: 100%;
  }
  .allCategory .cate .subCate {
    padding: 10px;
  }
  .allCategory .cate .subCate:hover{
    background-color: #dacfd9;
    border-radius: 10px;
  }
</style>
