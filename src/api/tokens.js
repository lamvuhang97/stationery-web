import axios from "axios";
import Vue from "vue";
import api from ".";

export const tokens = {
    async create(payload) {
      return await axios
        .post(Vue.prototype.$settings.baseURL + "/access-tokens", payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    }
  };
  