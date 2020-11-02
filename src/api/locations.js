import axios from "axios";
import Vue from "vue";
import api from ".";
import { settings } from "@/library/variables";

export const locations = {
    async get() {
        return await axios.get(
          Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/blockable-locations"
        );
    },

    async getgroups() {
        return await axios.get(
            Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/blockable-groups"
          );
    },

    
    async update(id, payload) {
      return await axios
        .patch(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/views/" + id, payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async delete(id) {
      return await axios
        .delete(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/blockable-groups/" + id, null)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async create(payload) {
      return await axios
        .post(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/blockable-groups", payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    }
  };
  