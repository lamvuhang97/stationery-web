import axios from "axios";
import Vue from "vue";

export const orders = {
    async getMyTransaction() {
      return await axios.get("orders/my-transaction", {
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

    async getMyOrder() {
      return await axios.get("orders/my-order", {
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

    async getOrderdetailsByOrder(id) {
      return await axios.get("orderdetails/order/" + id, {
        headers: {
          Authorization: Vue.prototype.$localstorage.getAccessToken()
        }
      })
      .catch(error => {
        // return api.response.error(error.response.data);
        console.log("not login yet", error);
        return
      });
    }
  
    // async updateProductAmount(id, payload) {
    //   return await axios
    //     .put("carts/" + id, payload)
    //     .catch(error => {
    //       return api.response.error(error.response.data);
    //     });
    // },
    // async deleteCart(id) {
    //   return await axios
    //     .delete("carts/" + id)
    //     .catch(error => {
    //       return api.response.error(error.response.data);
    //     });
    // },
    // async createCart(payload) {
    //   return await axios
    //     .post("/carts", payload, {
    //       headers: {
    //         Authorization: Vue.prototype.$localstorage.getAccessToken()
    //       }
    //     })
    //     .catch(error => {
    //       return api.response.error(error.response.data);
    //     });
    // }
  };
  