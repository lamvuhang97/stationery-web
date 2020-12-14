import axios from "axios";
import Vue from "vue";

export const transactions = {
  async getMyTransactions() {
    return await axios.get(
      Vue.prototype.$settings.baseURL + "/transactions/my-transaction",
      {
        headers: {
          Authorization: Vue.prototype.$localstorage.getAccessToken()
        }
      }
    );
  },

  async postTransaction(payload) {
    return await axios.post("transactions", payload)
      .catch(error => {
        // return api.response.error(error.response.data);
        console.log("not found", error);
        return
    });
  },

  async updateTransaction(id, payload) {
    return await axios.put("transactions/" + id, payload)
      .catch(error => {
        // return api.response.error(error.response.data);
        console.log("not found", error);
        return
    });
  }
}