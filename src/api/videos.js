import axios from "axios";
import Vue from "vue";
import api from ".";
import { settings } from "@/library/variables";

export const videos = {
    async get(id) {
      if (id) {
        return await axios.get(
          Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/videos/" + id
        );
      } else {
        return await axios.get(
          Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/videos",
          null
        );
      }
    },
  
    async updateVideo(id, payload) {
      return await axios
        .patch(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/videos/" + id, payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async updateImage(id, payload) {
      return await axios
        .post(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/videos/" + id + '/images', payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async delete(id) {
      return await axios
        .delete(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/videos/" + id, null)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async create(payload) {
      return await axios
        .post(Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/videos", payload)
        .catch(error => {
          return api.response.error(error.response.data);
        });
    },
    async getVideoSources() {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/videos/sources"
      );
    },
    async searchVideoSources(term) {
      return await axios.get(
        Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/videos/sources?filter[name]=" + term
      );
    },
  }  