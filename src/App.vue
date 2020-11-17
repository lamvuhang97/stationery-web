<template>
  <span>
    <!-- <div v-if="!authenticated">
      <router-view @authenticated="setAuthenticated" />
    </div> -->
    <div id="wrapper" class="wrapper" >
      <topnav></topnav>
      <sidebar v-if="showBar"></sidebar>
      <div class="d-flex flex-column" id="content-wrapper">
        <div id="content">
          <router-view  />
        </div>
        <bottom-footer></bottom-footer>
      </div>
    </div>
  </span>
</template>

<script>
import Vue from "vue";
import Table from "@/components/Table";
import CustomForm from "@/components/Form";
import CustomFormGrouping from "@/components/FormGrouping";
import Sidebar from "./views/sidebar.vue";
import Topnav from "./views/topnav.vue";
import BottomFooter from "./views/footer.vue";
import { settings } from "./library/variables";
import axios from "axios";
import api from "@/api";
import { localstorage } from "@/services/storage/localStorageService";
import Toasted from "vue-toasted";
import Vuelidate from "vuelidate";

Vue.prototype.$settings = settings;
Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
Vue.prototype.$localstorage = localstorage;

Vue.use(Vuelidate);
Vue.component("custom-table", Table);
Vue.component("custom-form", CustomForm);
Vue.component("custom-form-grouping", CustomFormGrouping);

Vue.prototype.$axios.interceptors.request.use(
  config => {
    config.baseURL = settings.baseURL;
    const token = localstorage.getAccessToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);
Vue.prototype.$axios.interceptors.response.use(
  response => {
    return response;
  },
  function(error) {
    if (error.response.status == 401 && window.location.pathname !== '/login') {
      localstorage.clearToken();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);
Vue.use(Toasted, {
  duration: 3000,
  theme: "outline",
  position: "top-right",
  containerClass: "toastcontainer"
});
export default {
  name: "App",
  components: {
    Sidebar,
    Topnav,
    BottomFooter
  },
  data() {
    return {
      authenticated: localstorage.getAccessToken() != null,
      showBar: true
    };
  },
  watch: {
      '$route': function () {
          console.log("route", this.$route);
          if(this.$route.fullPath === "/account" || this.$route.name === "User"){
            this.showBar = false 
          } else {
            this.showBar = true
          }

      }
  },
  methods: {
    setAuthenticated(status) {
      this.authenticated = status;
      this.$router.push({ name: "Home" });
    },
    logout() {
      localstorage.clearToken();
      this.authenticated = false;
      this.$router.push({ name: "Login" });
    }
  }
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  overflow: hidden !important;
}
</style>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
}
</style>
