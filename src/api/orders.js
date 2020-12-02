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
    },

    async getOrderAnalyze() {
      return await axios.get("orders/my-order/analyze", {
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

    async getSaleAnalyze() {
      return await axios.get("orders/my-order/sale-analyze", {
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

    async createOrder(payload) {
      return await axios.post("orders", payload, {
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

    async createOrderdetail(payload) {
      return await axios.post("orderdetails", payload, {
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

    async updateOrderStatus(payload) {
      return await axios.put("orders/" + payload.orderId, {id: payload.statusId}, {
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

  };
  