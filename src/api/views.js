import axios from "axios";
import Vue from "vue";
import api from ".";
import { settings } from "@/library/variables";

export const views = {
    async get(id) {
      if (id) {
        return await axios.get(
          Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/views/" + id + '?include=featured,entities'
        );
      } else {
        return await axios.get(
          Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/views",
          null
        );
      }
    },

    async getViewFeatured() {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/videos?sort=-updated_at"
      )
    },

    async getViewMain() {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/collections?sort=-updated_at"
      )
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
        .delete(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/views/" + id, null)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async create(payload) {
      return await axios
        .post(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/views", payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    }
  };
  