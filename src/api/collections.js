import axios from "axios";
import Vue from "vue";
import api from ".";
import { settings } from "@/library/variables";

export const collections = {
    async get(id) {
      if (id) {
        return await axios.get(
          Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/collections/" + id + "?include=entities"
        );
      } else {
        return await axios.get(
          Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/collections",
          null
        );
      }
    },
  
    async updateCollection(id, payload) {
      return await axios
        .patch(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/collections/" + id, payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async updateImage(id, payload) {
      return await axios
        .post(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/collections/" + id + '/images', payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async delete(id) {
      return await axios
        .delete(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/collections/" + id, null)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async create(payload) {
      return await axios
        .post(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/collections", payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    }
  };
  