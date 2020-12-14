import api from ".";
import { settings } from "@/library/variables";
import axios from 'axios';
import Vue from "vue";

export const authentications = {
  // async login(data) {
  //   try {
  //     return await axios.post(
  //       `/login`,
  //       {},
  //       {
  //         headers: {
  //           Authorization:
  //             'Basic ' +
  //             Buffer.from(data.Email + ':' + data.Password).toString('base64')
  //         }
  //       }
  //     )
  //   } catch (err) {
  //     return api.response.error(err)
  //   }
  // },
  async login(payload) {
    try {
      return await axios.post("/auth/login",payload)
    } catch (err) {
      return api.response.error(err)
    }
  },
  // async register(payload) {
  //   return await axios
  //     .post("/register", payload)
  //     .catch(error => {
  //       return api.response.error(error.response.data);
  //     })
  // },
  async forgotPassword(payload) {
    return await axios
      .post("/forgot-password", payload)
      .catch(error => {
        return api.response.error(error.response.data);
      })
  },
  async resetPassword(id) {
    return await axios
      .post(settings.baseURL + "/properties/" + settings.propertyID + "/subscribers/" + id + '/reset-password', null)
      .catch(error => {
        return api.response.error(error.response.data);
      });
  },
  async getProfile() {
    return await axios
      .get("/users/profile", {
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
  async updateProfile(payload) {
    return await axios
      .put("/users/profile", payload,{
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
  async updateWallet(id, payload) {
    return await axios
      .put("/users/wallet/" + id, payload)
      .catch(error => {
        // return api.response.error(error.response.data);
        console.log("err", error);
        return
      });
  }
};
