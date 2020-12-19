import axios from "axios";
import Vue from "vue";
import api from ".";

export const history = {
  async getHistoryByOrder(id) {
    return await axios.get(
      Vue.prototype.$settings.baseURL + "/histories/" + id,
      null
    );
  },
    async createHistory(payload) {
      return await axios
        .post(Vue.prototype.$settings.baseURL + "/histories", payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    }
  };
  