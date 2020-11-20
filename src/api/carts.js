import axios from "axios";
import Vue from "vue";
import api from ".";

export const carts = {
    async getMyCart() {
      return await axios.get("carts/mycart", {
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
  
    async updateProductAmount(id, payload) {
      return await axios
        .put("carts/" + id, payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async deleteCart(id) {
      return await axios
        .delete("carts/" + id)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async createCart(payload) {
      return await axios
        .post("/carts", payload, {
          headers: {
            Authorization: Vue.prototype.$localstorage.getAccessToken()
          }
        })
        .catch(error => {
          return api.response.error(error.response.data);
        });
    }
  };
  