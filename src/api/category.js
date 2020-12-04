import axios from "axios";
import Vue from "vue";
import api from ".";
import { settings } from "@/library/variables";

export const category = {
  async getAllCategory() {
    return await axios.get(
      Vue.prototype.$settings.baseURL + "/categories",
      null
    );
  },
    async getAllCategorysum() {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/categorysum",
        null
      );
    },
    async getAllProductByCategorysum(name) {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/categorysum/" + name,
        null
      );
    },
    async getProductByCategoryName(name, offset, limit) {
      if(offset != null && limit != null) {
        console.log("1");
        return await axios.get(
          Vue.prototype.$settings.baseURL + "/categories/" + name + "?offset=" + offset + "&limit=" + limit
        );
      } else {
        console.log("2");
        return await axios.get(
          Vue.prototype.$settings.baseURL + "/categories/" + name 
        );
      }
        
    },
  
    async update(id, payload) {
      return await axios
        .patch(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/documents/" + id, payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async delete(id) {
      return await axios
        .delete(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/documents/" + id, null)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async create(payload) {
      return await axios
        .post(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/documents", payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    }
  };
  