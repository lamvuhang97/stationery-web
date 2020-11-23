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
import User from "../views/user.vue";
import UserProducts from "../views/userProducts";
import Shop from "../views/shop";
import MyProducts from "../views/myProducts";
import Analyze from "../views/analyze";
import Orders from "../views/orders";
import ProductCRUD from "../views/productCRUD";
import Transaction from "../views/transaction";
import OrderDetail from "../views/orderDetail"

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
    children: [
      {
        path: "transaction/:status",
        name: "Transaction",
        component: Transaction,
        meta: {
          requiresAuth: true,
        },
      },
    ]
  },
  {
    path: "/order-detail",
    name: "OrderDetail",
    component: OrderDetail,
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
    path: "/shop",
    name: "Shop",
    component: Shop,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'products',
        name: "MyProducts",
        component: MyProducts
      },
      {
        path: 'analyze',
        name: "Analyze",
        component: Analyze
      },
      {
        path: 'orders',
        name: "Orders",
        component: Orders
      },
      {
        path: 'new-product',
        name: "ProductCRUD",
        component: ProductCRUD
      }
    ]
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
        path: 'new-arrival',
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
