import axios from "axios";
import Vue from "vue";
import api from ".";
import { settings } from "@/library/variables";

export const products = {
    async get(id) {
      if (id) {
        return await axios.get(
          Vue.prototype.$settings.baseURL + "/products/" + id
        );
      } else {
        return await axios.get(
          Vue.prototype.$settings.baseURL + "/products",
          null
        );
      }
    },

    async getMyProducts() {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/products/my-product",
        {
          headers: {
            Authorization: Vue.prototype.$localstorage.getAccessToken()
          }
        }
      );
    },

    async getNewArrival(limit) {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/products/new-arrival?limit=" + limit,
        null
      );
    },

    async getTopSellingByUser(id) {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/products/user/" + id + "/best-seller",
        null
      );
    },

    async getTopSelling(limit) {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/products/best-seller?limit=" + limit,
        null
      );
      
    },

    async getProductsByGroupId(ids) {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/products/group-id/" + ids,
        null
      );
    },

    async getProductsByOwner(id) {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/products/user/" + id,
        null
      );
    },
  
    async update(id, payload) {
      return await axios
        .patch(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/documents/" + id, payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async delete(id) {
      return await axios
        .delete(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/documents/" + id, null)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async createProduct(payload) {
      return await axios
        .post(Vue.prototype.$settings.baseURL + "/products", payload, {
          headers: {
            Authorization: Vue.prototype.$localstorage.getAccessToken()
          }
        })
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },

    async postImageUrl(payload) {
      return await axios
        .post(Vue.prototype.$settings.baseURL + "/images", payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },

    async postProductImage(payload) {
      return await axios
        .post(Vue.prototype.$settings.baseURL + "/images/product-image", payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    }
  };
  