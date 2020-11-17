import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/login.vue";
import Account from "../views/account.vue";
import Home from "../views/home.vue";
import Category from "../views/category.vue";
import TopSelling from "../views/topSelling.vue";
import NewArrival from "../views/newArrival.vue";
import ProductDetail from "../views/productDetail.vue";
import Cart from "../views/cart.vue";
import User from "../views/user.vue"
import UserProducts from "../views/userProducts"

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
  {
    path: "/account",
    name: "Account",
    component: Account,
    meta: {
      requiresAuth: true,
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
    path: "/category/:categoryName",
    name: "Category",
    component: Category,
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
    path: "/product/:id",
    name: "ProductDetail",
    component: ProductDetail,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/user/:id",
    name: "User",
    component: User,
    meta: {
      requiresAuth: false,
    },
    children: [
      {
        path: 'products',
        name: "UserProducts",
        component: UserProducts
      },
      {
        path: 'top-selling',
        name: "TopSelling",
        component: UserProducts
      },
      {
        path: '/new-arrival',
        name: "NewArrival",
        component: UserProducts
      }
    ]
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
