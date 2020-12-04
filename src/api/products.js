import axios from "axios";
import Vue from "vue";
import api from ".";

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

    async getNewArrival(offset,limit) {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/products/new-arrival" + "?offset=" + offset + "&limit=" + limit,
        null
      );
    },

    async getTopSellingByUser(id) {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/products/user/" + id + "/best-seller",
        null
      );
    },

    async getTopSelling(offset,limit) {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/products/best-seller" + "?offset=" + offset + "&limit=" + limit,
        null
      );
      
    },

    async getProductsByGroupId(ids) {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/products/group-id/" + ids,
        null
      );
    },

    async getProductsByOwner(id, offset, limit) {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/products/user/" + id + "?offset=" + offset + "&limit=" + limit,
        null
      );
    },

    async getProductByCategory(id, offset, limit) {
      if(offset != null && limit != null) {
        return await axios.get(
          Vue.prototype.$settings.baseURL + "/products/category/" + id + "?offset=" + offset + "&limit=" + limit
        );
      } else {
        return await axios.get(
          Vue.prototype.$settings.baseURL + "/products/category/" + id 
        );
      }
    },
  
    async getProductAnalyze() {
      return await axios.get("products/my-product/analyze", {
        headers: {
          Authorization: Vue.prototype.$localstorage.getAccessToken()
        }
      })
      .catch(error => {
        // return api.response.error(error.response.data);
        console.log("not login yet", error);
        return
      });
    }, 

    async searchProduct(searchkey) {
      return await axios.get("products/search?searchkey=" + searchkey)
      .catch(error => {
        // return api.response.error(error.response.data)
        console.log("notfound", error);
        return
      });
    },

    async updateProduct(id, payload) {
      return await axios
        .put(Vue.prototype.$settings.baseURL + "/products/" + id, payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },

    async deleteProductImage(id) {
      return await axios
        .delete(Vue.prototype.$settings.baseURL + "/images/" + id, null)
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
      console.log("payload", payload);
      return await axios
        .post(Vue.prototype.$settings.baseURL + "/images/product-image", payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },

    async getProductImage(productId) {
      return await axios
        .get(Vue.prototype.$settings.baseURL + "/images/product/" + productId)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    }
  };
  