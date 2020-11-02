import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/login.vue";
import Dashboard from "../views/dashboard.vue";
import Users from "../views/users.vue";
import Products from "../views/products.vue";
import Category from "../views/category.vue";
import Orders from "../views/orders.vue";
import Reviews from "../views/reviews.vue";

import Subscribers from "../views/subscribers.vue";
import SubscribersCRUD from "../views/subscribersCRUD.vue";
import Videos from "../views/videos.vue";
import Tokens from "../views/tokens.vue";
import TokensCRUD from "../views/tokensCRUD.vue";
import Collections from "../views/collections.vue";
import CollectionsCRUD from "../views/collectionsCRUD.vue";
import Documents from "../views/documents.vue";
import DocumentsCRUD from "../views/documentsCRUD.vue";
import Views from "../views/views.vue";
import ViewsCRUD from "../views/viewsCRUD.vue";
import Entitlements from "../views/entitlements.vue";
import EntitlementsCRUD from "../views/entitlementsCRUD.vue";
import NotFound from "../views/notfound.vue";
import UsersCRUD from "../views/usersCRUD";
import VideosCRUD from "../views/videosCRUD";
import UploadVideoFile from "../views/uploadvideo.vue";
import Tags from "../views/tags.vue";
import TagsCRUD from "../views/tagsCRUD";

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
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/products",
    name: "Products",
    component: Products,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/category",
    name: "Category",
    component: Category,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/orders",
    name: "Orders",
    component: Orders,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/reviews",
    name: "Reviews",
    component: Reviews,
    meta: {
      requiresAuth: true,
    },
  },



  {
    path: "/subscribers",
    name: "Subscribers",
    component: Subscribers,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/subscribers/update",
    name: "SubscribersUpdate",
    component: SubscribersCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/subscribers/create",
    name: "SubscribersCreate",
    component: SubscribersCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/videos",
    name: "Videos",
    component: Videos,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/videos/new",
    name: "VideosCreate",
    component: VideosCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/videos/update",
    name: "VideosUpdate",
    component: VideosCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/videos/upload",
    name: "UploadVideoFile",
    component: UploadVideoFile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/tokens",
    name: "Tokens",
    component: Tokens,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/tokens/new",
    name: "TokensCRUD",
    component: TokensCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/collections",
    name: "Collections",
    component: Collections,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/collections/new",
    name: "CollectionsCreate",
    component: CollectionsCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/collections/update",
    name: "CollectionsUpdate",
    component: CollectionsCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/documents",
    name: "Documents",
    component: Documents,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/documents/new",
    name: "DocumentsCreate",
    component: DocumentsCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/documents/update",
    name: "DocumentsUpdate",
    component: DocumentsCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/views",
    name: "Views",
    component: Views,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/views/update",
    name: "ViewsUpdate",
    component: ViewsCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/views/new",
    name: "ViewsCreate",
    component: ViewsCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/entitlements",
    name: "Entitlements",
    component: Entitlements,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/entitlements/new",
    name: "EntitlementsCreate",
    component: EntitlementsCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/entitlements/update",
    name: "EntitlementsUpdate",
    component: EntitlementsCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/users/update",
    name: "UsersUpdate",
    component: UsersCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/users/create",
    name: "UsersCreate",
    component: UsersCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/tags/update",
    name: "TagUpdate",
    component: TagsCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/tags/create",
    name: "TagCreate",
    component: TagsCRUD,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/tags",
    name: "Tags",
    component: Tags,
    meta: {
      requiresAuth: true,
    },
  },
  
  {
    path: "*",
    component: NotFound,
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
