import axios from "axios";
import Vue from "vue";
import api from ".";

export const exportexcel = {
  async exportProduct(userId) {
    return await axios.get("exportexcel/product/" + userId)
      .catch(error => {
        // return api.response.error(error.response.data);
        console.log("not login yet", error);
        return
      });
  },
    async createHistory(payload) {
      return await axios
        .post(Vue.prototype.$settings.baseURL + "/histories", payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    }
  };
  