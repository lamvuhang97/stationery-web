<template>
  <div class="topnav">
    <div class="logo" @click="returnHome">
      <img src="/assets/img/playlist.png" alt="" style="height:100px">
    </div>
    <div class="search">
      <input type="text" placeholder="Search here">
      <img src="/assets/svg/search.svg" alt="">
    </div>
    <div class="right-side">
      <a v-if="!authenticated" @click="showLogin"> Login</a>
      <div class="top-sidebar" v-if="authenticated">
        <div class="currentUser">
          {{currentUser}}
        </div>
        <div class="sidebar">
          <ul class="nav nav-pills">
            <li class="nav-item dropdown account">
              <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button">
                <img src="/assets/svg/account.svg" alt="">
              </a>
              <div class="dropdown-menu">
                <a class="dropdown-item" @click="userProfile">Tài khoản</a>
                <a class="dropdown-item" @click="managerShop">Cửa hàng</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" @click="handleLogout">Logout</a>
              </div>
            </li>
            <li class="nav-item dropdown notification">
              <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button">
                <img src="/assets/svg/bell.svg" alt="">
              </a>
              <!-- <div class="dropdown-menu">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <a class="dropdown-item" href="#">Something else here</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Separated link</a>
              </div> -->
            </li>
            <li class="nav-item dropdown cart">
              <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" @click="toCart">
                <img src="/assets/svg/cart.svg" alt="">
                <span class="num">{{cartSize}}</span>
              </a>
            </li>
            
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
export default {
  data() {
    return {
      currentUser: Vue.prototype.$localstorage.getName(),
    };
  },
  computed: {
    authenticated() {
      return  Vue.prototype.$localstorage.getAccessToken() != null
    },
    cartSize() {
      return this.$store.getters.cartSize
    }
  },
  async beforeMount() {
        await this.$store.dispatch('fetchCart')
    },
  methods: {
    showLogin() {
      this.$router.push({name: "Login"})
    },
    returnHome() {
      this.$router.push({name: "Home"})
    },
    handleLogout() {
      this.$parent.logout();
    },
    toCart() {
      this.$router.push({name: "Cart"})
    },
    managerShop() {
      this.$router.push({name: "Shop"})
    },
    userProfile() {
      this.$router.push({name: "Account"})
      // if (this.$route.name != "UsersUpdate") {
      //   this.$api.users
      //     .getUserInfo()
      //     .then(async (response) => {
      //       this.$router.push({ name: "UsersUpdate", params: response.data });
      //     })
      //     .catch(error => {
      //       return Promise.reject(error);
      //     })
      // }
    }
  },
};
</script>
<style scope>
  .topnav {
    display: flex;
    background-color: white;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    z-index: 100;
    width: 100%;
  }
  .topnav .right-side {
        margin-right: 20px;
  }
  .logo {
      padding-left: 20px;
  }
  .logo img {
    height: 80px;
    width: 200px;
  }
  .search {
    text-align: center;
    width: 80%;
    position: relative;
  }
  .search input {
    width: 80%;
    padding: 10px;
    border-radius: 10px;
    border: none;
    background-color: #e6e0e6;
  }
  .search img {
    width: 25px;
    position: absolute;
    right: 100px;
    top: 10px;
  }
  .currentUser {
    width: 60% ;
  }
  .sidebar {
    width: auto;
  }
  .sidebar .nav-item {
      position: relative;
      padding-left: 10px;
  }
  .top-sidebar {
    display: flex;
    align-items: baseline;
  }
  .dropdown-toggle:after {
    display: none;
  } 
  .dropdown-menu {
    position: absolute;
    transform: translate3d(-100px, 52px, 0px) !important;
    top: 0px;
    left: -10px !important;
    will-change: transform;
  }
  .nav-link {
    width: 20px !important;
  } 
  .nav-link img {
    width: 20px;
  }
  .num {
    border: 1px solid red;
    border-radius: 50%;
    background-color: red;
    color: white;
    position: absolute;
    z-index: 2;
    top: 9px;
    left: 30px;
    height: 17px;
    width: 17px;
    text-align: center;
    font-weight: 600;
    font-size: 13px;
  }
</style>