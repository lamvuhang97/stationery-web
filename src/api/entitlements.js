import axios from "axios";
import Vue from "vue";
import api from ".";
import { settings } from "@/library/variables";

export const entitlements = {
  async get(id) {
    if (id) {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/entitlements/" + id
      );
    } else {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/entitlements",
        null
      );
    }
  },

  async update(id, payload) {
    return await axios
      .patch(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/entitlements/" + id, payload)
      .catch(error => {
        return api.response.error(error.response.data);
      });
  },
  async delete(id) {
    return await axios
      .delete(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/entitlements/" + id, null)
      .catch(error => {
        return api.response.error(error.response.data);
      });
  },
  async create(payload) {
    return await axios
      .post(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/entitlements", payload)
      .catch(error => {
        return api.response.error(error.response.data);
      });
  },
  async purchase(id, payload) {
    return await axios
      .post(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/subscribers/" + id + "/purchase", payload)
      .catch(error => {
        return api.response.error(error.response.data);
      });
  },
  
};
