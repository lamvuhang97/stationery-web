import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/login.vue";
import Home from "../views/home.vue";
import TopSelling from "../views/topSelling.vue";
import NewArrival from "../views/newArrival.vue";

// import Register from "../views/register.vue";
// import ForgotPassword from "../views/forgotPassword.vue";
// import ResetPassword from "../views/resetPassword.vue";
import { localstorage } from "@/services/storage/localStorageService";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      requiresAuth: false,
    },
  },
  // {
  //   path: "/register",
  //   name: "Register",
  //   component: Register,
  //   meta: {
  //     requiresAuth: false,
  //   },
  // },
  // {
  //   path: "/forgot-password",
  //   name: "ForgotPassword",
  //   component: ForgotPassword,
  //   meta: {
  //     requiresAuth: false,
  //   },
  // },
  // {
  //   path: "/reset-password/:email/:token",
  //   name: "ResetPassword",
  //   component: ResetPassword,
  //   meta: {
  //     requiresAuth: false,
  //   },
  // },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/topselling",
    name: "TopSelling",
    component: TopSelling,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/newarrival",
    name: "NewArrival",
    component: NewArrival,
    meta: {
      requiresAuth: false,
    },
  },
  
  {
    path: "*",
    component: Home,
    meta: {
      requiresAuth: false,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localstorage.getAccessToken() == null) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
