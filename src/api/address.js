import axios from "axios";
import Vue from "vue";

export const address = {
  async getMyAddress() {
    return await axios.get("addresses/my-address", {
        headers: {
          Authorization: Vue.prototype.$localstorage.getAccessToken()
        }
      })
      .catch(error => {
        // return api.response.error(error.response.data);
        console.log("not login yet", error);
        return
      });
  },

  async getAddress(id) {
    return await axios.get("addresses/" + id)
    .catch(error => {
      // return api.response.error(error.response.data);
      console.log("not found", error);
      return
    });
  },

  async getProvince() {
    return await axios.get("addresses/province")
    .catch(error => {
      // return api.response.error(error.response.data);
      console.log("not found", error);
      return
    });
  },

  async getDistrictByProvince(provinceId) {
    return await axios.get("addresses/district/" + provinceId)
    .catch(error => {
      // return api.response.error(error.response.data);
      console.log("not found", error);
      return
    });
  },

  async postAddress(payload) {
    return await axios.post("addresses", payload)
      .catch(error => {
        // return api.response.error(error.response.data);
        console.log("not found", error);
        return
    });
  }


    
};
  